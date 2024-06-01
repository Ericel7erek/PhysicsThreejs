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
        const geometry = new THREE.TorusKnotGeometry(1,0.4,32,8 ,2)
        console.log(geometry.index.array);
        const material = new THREE.MeshStandardMaterial({color: "blue"})
        this.cubeMesh = new THREE.Mesh(geometry, material)
        this.cubeMesh.position.y = 10
        this.cubeMesh.rotation.x = 0.5
        this.cubeMesh.scale.setScalar(5)
        group.add(this.cubeMesh)
        this.scene.add(group)
        this.physics.add(this.cubeMesh,'dynamic','cuboid')
        // Second Cube
        this.cubeMesh2 = new THREE.Mesh(geometry, material)
        this.cubeMesh2.position.y = 12
        this.cubeMesh2.rotation.x = 0.5
        this.scene.add(this.cubeMesh2)
        this.physics.add(this.cubeMesh2,'dynamic','cuboid')

        // Plane Threejs
            const planeGeometry = new THREE.BoxGeometry(10,1,10)
            const planeMaterial = new THREE.MeshStandardMaterial({color:"white"})
            this.planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
            this.scene.add(this.planeMesh)
            this.physics.add(this.planeMesh, 'fixed','cuboid')
    }
}