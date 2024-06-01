import * as THREE from 'three'
import App from '../App.js'
import RAPIER from '@dimforge/rapier3d'
import { appStateStore } from '../Utils/Store.js'

export default class Physics {
    constructor() {
        this.app = new App()
        this.scene = this.app.scene
        this.meshMap = new Map()
        import('@dimforge/rapier3d').then(RAPIER => {
            const gravity = {x: 0, y: -9.81, z: 0}
            this.world = new RAPIER.World(gravity)
            this.rapier = RAPIER


            // Plane Threejs
            const planeGeometry = new THREE.BoxGeometry(10,1,10)
            const planeMaterial = new THREE.MeshStandardMaterial({color:"white"})
            this.planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
            this.scene.add(this.planeMesh)
            // Plane Rapierjs
            const rigidBodyFixed = RAPIER.RigidBodyDesc.fixed()
            this.rigidFixed = this.world.createRigidBody(rigidBodyFixed)

            const colliderPlane = RAPIER.ColliderDesc.cuboid(5,0.5,5)
            this.world.createCollider(colliderPlane,this.rigidFixed)

            this.rapierLoaded = true
            appStateStore.setState({physicsReady: true})

        })
    }
    add(mesh){
            // Box Rapierjs
            const rigidBodyDynamic = this.rapier.RigidBodyDesc.dynamic()
            this.rigidBody = this.world.createRigidBody(rigidBodyDynamic)
            this.rigidBody.setTranslation(mesh.position)
            this.rigidBody.setRotation(mesh.quaternion)

            // autocompute dimensions
            const colliderType = this.rapier.ColliderDesc.cuboid(0.5,0.5,0.5)
            this.world.createCollider(colliderType,this.rigidBody)
            
            this.meshMap.set(mesh,this.rigidBody)
    }

    loop() {
        if(this.rapierLoaded){
            this.world.step()
            this.meshMap.forEach((rigidBody,mesh) =>{

                const position = rigidBody.translation()
                const rotation = rigidBody.rotation()
    
                mesh.position.copy(position)
                mesh.quaternion.copy(rotation)
            } )



        }
    }
}