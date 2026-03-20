import * as THREE from 'three';

export class Block {
    constructor(x, y, z, type = 'grass') {
        this.position = new THREE.Vector3(x, y, z);
        this.type = type;
    }

    getColor() {
        switch (this.type) {
            case 'grass': return 0x48a044;
            case 'dirt': return 0x866043;
            case 'bed': return 0xe22727; // Cor para o Bedwars
            default: return 0xffffff;
        }
    }
}
