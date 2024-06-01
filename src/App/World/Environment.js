import * as THREE from 'three';
import App from '../App.js';

export default class Environment{
    constructor() {
        this.app = new App()
        this.scene = this.app.scene
        this.physics = this.app.world.physics
        console.log();
        this.loadEnvironment()
        this.addMeshes()
    }

    loadEnvironment() {

        // lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.directionalLight.position.set(1, 1, 1);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight);
    }

    addMeshes(){
        const group = new THREE.Group()
        group.position.set(0,5,0)
        const geometry = new THREE.BoxGeometry(1,1,1)
        const material = new THREE.MeshStandardMaterial({color: "blue"})
        this.cubeMesh = new THREE.Mesh(geometry, material)
        this.cubeMesh.position.y = 10
        this.cubeMesh.rotation.x = 0.5
        this.cubeMesh.scale.setScalar(5)
        group.add(this.cubeMesh)
        this.scene.add(group)
        this.physics.add(this.cubeMesh)
        
        this.cubeMesh2 = new THREE.Mesh(geometry, material)
        this.cubeMesh2.position.y = 12
        this.cubeMesh2.rotation.x = 0.5
        this.scene.add(this.cubeMesh2)
        this.physics.add(this.cubeMesh2)
    }
}