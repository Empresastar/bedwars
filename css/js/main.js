import * as THREE from 'three';
import { Player } from './player.js';
import { World } from './world.js';

console.log("Jogo inicializando..."); // Se isso aparecer no F12, o 404 sumiu!

let scene, camera, renderer, player, world, prevTime = performance.now();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Luz total (Ambient) para evitar tela preta
    const light = new THREE.AmbientLight(0xffffff, 1); 
    scene.add(light);

    player = new Player(camera, renderer.domElement);
    camera.position.set(0, 5, 5); 

    world = new World(scene);
    world.generate(15);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = Math.min((time - prevTime) / 1000, 0.1);
    player.update(delta);
    renderer.render(scene, camera);
    prevTime = time;
}

init();
