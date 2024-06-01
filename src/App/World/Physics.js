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



            this.rapierLoaded = true
            appStateStore.setState({physicsReady: true})

        })
    }
    add(mesh, type, collider){

        // defining the rigid body type
        let rigidBodyType
        if(type === 'dynamic'){
            rigidBodyType = this.rapier.RigidBodyDesc.dynamic()
            
        } else if (type === 'fixed') {
            rigidBodyType = this.rapier.RigidBodyDesc.fixed()
            
        }
        // Box Rapierjs
        this.rigidBody = this.world.createRigidBody(rigidBodyType)
        
        // defining the collider type
        let colliderType
        switch (collider) {
            case 'cuboid':
            const dimensions = this.dimensionsCalculator(mesh)
            colliderType = this.rapier.ColliderDesc.cuboid(
                dimensions.x,
                dimensions.y,
                dimensions.z
                )
            this.world.createCollider(colliderType,this.rigidBody)
            break;
            case 'ball':
            const radius = this.computeBallDimensions(mesh)
            colliderType = this.rapier.ColliderDesc.ball(radius)
            this.world.createCollider(colliderType,this.rigidBody)

            break;
        }





        const worldPosition = mesh.getWorldPosition(new THREE.Vector3())
        const worldRotation = mesh.getWorldQuaternion(new THREE.Quaternion())
        this.rigidBody.setTranslation(worldPosition)
        this.rigidBody.setRotation(worldRotation)


        
        this.meshMap.set(mesh,this.rigidBody)
    }
    dimensionsCalculator(mesh){
        // autocompute dimensions
        mesh.geometry.computeBoundingBox()
        const size = mesh.geometry.boundingBox.max;
        const worldScale = mesh.getWorldScale(new THREE.Vector3())
        size.multiply(worldScale)
        return size
    }

    computeBallDimensions(mesh){
        mesh.geometry.computeBoundingSphere()
        const radius = mesh.geometry.boundingSphere.radius
        const worldScale = mesh.getWorldScale(new THREE.Vector3())
        const maxScale = Math.max(worldScale.x, worldScale.y, worldScale.z)
        return radius * maxScale
    }

    computeTrimesh(mesh){
        mesh.geometry
        const vertices = mesh.geometry.attributes.position.array
        const indices = mesh.geometry.index.array
        const maxScale = Math.max(worldScale.x, worldScale.y, worldScale.z)
        return radius * maxScale
    }

    loop() {
        if(this.rapierLoaded){
            this.world.step()
            this.meshMap.forEach((rigidBody,mesh) =>{

                const position = new THREE.Vector3().copy(rigidBody.translation())
                const rotation = new THREE.Quaternion().copy(rigidBody.rotation())
                
                mesh.parent.worldToLocal(position)

                const getinverseParentMatrix = new THREE.Matrix4().extractRotation(mesh.parent.matrixWorld).invert()
                const applyInverseParentRotation = new THREE.Quaternion().setFromRotationMatrix(getinverseParentMatrix)
                rotation.premultiply(applyInverseParentRotation)

                mesh.position.copy(position)
                mesh.quaternion.copy(rotation)
            } )



        }
    }
}