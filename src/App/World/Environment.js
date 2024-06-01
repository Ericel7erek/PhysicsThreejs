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
    addGround(){
        // Plane Threejs
        const planeGeometry = new THREE.BoxGeometry(100,1,100)
        const planeMaterial = new THREE.MeshStandardMaterial({color:"white"})
        this.planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
        this.scene.add(this.planeMesh)
        this.physics.add(this.planeMesh, 'fixed','cuboid')
    }

    addMeshes(){
        const geometry = new THREE.BoxGeometry(1,1,1)
        
        for (let i=0; i<1500; i++){
            let randomColor = Math.floor(Math.random()*16777215).toString(16);
            const material = new THREE.MeshStandardMaterial({color:new THREE.Color(randomColor==='Unknown Color'?"#7F7EFF":`#${randomColor}`)})

            const mesh = new THREE.Mesh(
                geometry,
                material
            )
            mesh.position.set(
                Math.random() * 100 - 50,
                Math.random() * 40,
                Math.random() * 100 - 50
            )
            mesh.scale.set(
                Math.random() + 0.5 ,
                Math.random() + 0.5 ,
                Math.random() + 0.5 
            )
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            )
            this.scene.add(mesh)
            this.physics.add(mesh,'dynamic','cuboid')
        }

        this.addGround()
    }
}