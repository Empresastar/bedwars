import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Player {
    constructor(camera, domElement) {
        this.controls = new PointerLockControls(camera, domElement);
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        document.addEventListener('keydown', (e) => this.onKey(e, true));
        document.addEventListener('keyup', (e) => this.onKey(e, false));
        document.addEventListener('click', () => this.controls.lock());
    }

    onKey(event, isDown) {
        switch (event.code) {
            case 'KeyW': this.moveForward = isDown; break;
            case 'KeyS': this.moveBackward = isDown; break;
            case 'KeyA': this.moveLeft = isDown; break;
            case 'KeyD': this.moveRight = isDown; break;
            case 'Space': if (isDown && Math.abs(this.velocity.y) < 0.1) this.velocity.y += 10; break;
        }
    }

    update(delta) {
        if (!this.controls.isLocked) return;

        const friction = 10.0;
        this.velocity.x -= this.velocity.x * friction * delta;
        this.velocity.z -= this.velocity.z * friction * delta;
        this.velocity.y -= 30.0 * delta; // Gravidade

        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();

        if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 400.0 * delta;
        if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 400.0 * delta;

        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);
        this.controls.getObject().position.y += this.velocity.y * delta;

        if (this.controls.getObject().position.y < 2) {
            this.velocity.y = 0;
            this.controls.getObject().position.y = 2;
        }
    }
}
