import * as THREE from 'three';

export class Block {
    constructor(x, y, z, type = 'grass') {
        this.position = new THREE.Vector3(x, y, z);
        this.type = type;
        this.mesh = null;
    }

    getTextureColor() {
        // Como você ainda não tem as imagens .png, vamos usar cores para não dar erro 404 de imagem
        switch (this.type) {
            case 'grass': return 0x4CAF50; // Verde
            case 'dirt': return 0x8B4513;  // Marrom
            default: return 0xffffff;
        }
    }
}
