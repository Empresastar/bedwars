// js/world.js
import * as THREE from 'three';
import { Block } from './block.js';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.blocks = [];
        this.textureLoader = new THREE.TextureLoader();
        this.blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    }

    generateFlatWorld(size = 20) {
        for (let z = 0; z < size; z++) {
            for (let x = 0; x < size; x++) {
                const block = new Block(x, 0, z, 'grass');
                this.blocks.push(block);

                const texture = this.textureLoader.load(block.getTexturePath());
                const material = new THREE.MeshBasicMaterial({ map: texture });
                const mesh = new THREE.Mesh(this.blockGeometry, material);
                mesh.position.copy(block.position);
                this.scene.add(mesh);
                block.mesh = mesh; // Guarda a referência da malha no objeto Block
            }
        }
    }

    // Futuramente, aqui virá a lógica de gerar chunks e otimizar.
}
