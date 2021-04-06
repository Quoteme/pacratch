import * as THREE from './three.module.js';

export class Arena{
	constructor(trainers=[]){
		this.trainers = trainers;
		this.mesh = new THREE.Object3D();
		//
		this.ground;
		this.light;
		this.initLight();
		this.initGround();
		//
		this.initTrainerMeshes();
	}

	/**
	 * List all the pacratcher currently active in the arena
	 */
	get active(){
		return this.trainers.map(t => t.active).flat();
	}

	initLight(){
		this.light = {
			ambient: new THREE.AmbientLight( 0xffffff, 0.5 ),
			spot: new THREE.SpotLight( 0xffffff )
		}
		this.light.spot.position.set(150,300,300)
		this.light.spot.castShadow = true;
		this.mesh.add(this.light.ambient);
		this.mesh.add(this.light.spot);
	}
	initGround(){
		this.ground = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(700,700,20,20),
			new THREE.MeshLambertMaterial({color: 0x009A17, wireframe: true})
		)
		this.ground.receiveShadow = true;
		this.ground.rotateX(-Math.PI/2)
		this.mesh.add(this.ground);
	}

	/**
	 * Adds all the meshes from different trainers to the scene
	 * or removes them, if they are no longer needed
	 */
	initTrainerMeshes(){
		this.active.forEach(p =>this.mesh.add(p.mesh))
	}

	/**
	 * Update the active pacratcher (add missing ones, delet defeated, ...)
	 */
	updatePacratcher(){
		// check if every active pacratch is in the arena
		// TODO
	}
}
