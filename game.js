import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x6eb1ff);
const camera = new THREE.PerspectiveCamera(85, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light, new THREE.AmbientLight(0x707070));

let blocks = [];
let inventory = { blocks: 999 }; 
let velocityY = 0;
const gravity = -0.008;
const jumpForce = 0.11;

function createCube(x, y, z, color = 0xdddddd) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color }));
    mesh.position.set(Math.round(x), Math.round(y), Math.round(z));
    scene.add(mesh);
    blocks.push(mesh);
    return mesh;
}

// Chão inicial
for(let x=-2; x<=2; x++) { for(let z=-2; z<=2; z++) { createCube(x, 0, z, 0x55aa55); } }

let keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function animate() {
    requestAnimationFrame(animate);
    let isSneaking = keys['shift'];
    let speed = isSneaking ? 0.05 : 0.13;
    let targetHeight = isSneaking ? 1.35 : 1.7;

    const dir = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);
    dir.y = 0; dir.normalize();
    const side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0,1,0)).normalize();

    // Movimentação simples
    if(keys['w']) { camera.position.x += dir.x * speed; camera.position.z += dir.z * speed; }
    if(keys['s']) { camera.position.x -= dir.x * speed; camera.position.z -= dir.z * speed; }
    if(keys['a']) { camera.position.x -= side.x * speed; camera.position.z -= side.z * speed; }
    if(keys['d']) { camera.position.x += side.x * speed; camera.position.z += side.z * speed; }

    velocityY += gravity;
    camera.position.y += velocityY;

    let onGround = false;
    blocks.forEach(b => {
        if(Math.abs(camera.position.x - b.position.x) < 0.6 && Math.abs(camera.position.z - b.position.z) < 0.6) {
            const blockTop = b.position.y + 0.5;
            if (camera.position.y - targetHeight <= blockTop && camera.position.y - blockTop >= 0) {
                camera.position.y = blockTop + targetHeight;
                velocityY = 0;
                onGround = true;
            }
        }
    });

    if(onGround && keys[' ']) velocityY = jumpForce;
    if(camera.position.y < -10) { camera.position.set(0, 5, 0); velocityY = 0; }
    renderer.render(scene, camera);
}

// --- SISTEMA DE PONTE ESTILO BEDROCK ---
window.addEventListener('mousedown', (e) => {
    if (document.pointerLockElement !== document.body) return;
    
    if (e.button === 0 && inventory.blocks > 0) {
        const ray = new THREE.Raycaster();
        ray.setFromCamera({x:0, y:0}, camera);
        const intersects = ray.intersectObjects(blocks);

        if (intersects.length > 0) {
            // Lógica padrão: Se clicar num bloco, coloca na face
            const hit = intersects[0];
            const newPos = hit.object.position.clone().add(hit.face.normal);
            if(!blocks.some(b => b.position.equals(newPos))) {
                createCube(newPos.x, newPos.y, newPos.z);
                inventory.blocks--;
            }
        } else {
            // LÓGICA BEDROCK: Se clicar no "nada" olhando para baixo/frente
            const dir = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);
            
            // Encontrar o bloco que está sob o jogador ou logo atrás
            const playerFloorPos = new THREE.Vector3(
                Math.round(camera.position.x),
                Math.round(camera.position.y - 1.7), // Nível do chão
                Math.round(camera.position.z)
            );

            // Calcula onde o bloco deve aparecer (na direção que você olha)
            const buildPos = playerFloorPos.clone().add(new THREE.Vector3(
                Math.round(dir.x),
                0,
                Math.round(dir.z)
            ));

            // Só coloca se estiver perto e não houver bloco
            const dist = buildPos.distanceTo(camera.position);
            if(dist < 4 && !blocks.some(b => b.position.equals(buildPos))) {
                createCube(buildPos.x, buildPos.y, buildPos.z);
                inventory.blocks--;
            }
        }
    }
});

document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== document.body) return;
    camera.rotation.order = 'YXZ';
    camera.rotation.y -= e.movementX * 0.002;
    camera.rotation.x -= e.movementY * 0.002;
    camera.rotation.x = Math.max(-1.5, Math.min(1.5, camera.rotation.x));
});

document.body.addEventListener('click', () => document.body.requestPointerLock());
window.oncontextmenu = (e) => e.preventDefault();
camera.position.set(0, 5, 0);
animate();
