// js/block.js
import * as THREE from 'three';

export class Block {
    constructor(x, y, z, type = 'grass') {
        this.position = new THREE.Vector3(x, y, z);
        this.type = type; // 'grass', 'dirt', 'stone', etc.
        this.mesh = null; // A malha 3D do bloco será criada em outro lugar
    }

    // Você pode adicionar métodos aqui para pegar a textura do bloco, etc.
    getTexturePath() {
        switch (this.type) {
            case 'grass': return 'assets/textures/grass_block_top.png';
            case 'dirt': return 'assets/textures/dirt.png';
            default: return 'assets/textures/missing_texture.png';
        }
    }
}
