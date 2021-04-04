import * as THREE from './three.module.js';

export class Arena{
	constructor(trainers=[]){
		this.trainers = trainers
		this.mesh = new THREE.Object3D();
		this.radius = 50+40*trainers.length;
		this.trainerBases;
		//
		this.ground;
		this.light;
		this.initLight();
		this.initGround();
		this.initTrainerBases();
		this.addPacratcher();
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
	initTrainerBases(){
		this.trainerBases = new THREE.Object3D();
		this.trainers.forEach((_,i) => {
			let base = new THREE.Object3D();
			let socket = new THREE.Mesh(
				new THREE.CylinderBufferGeometry(80,70,30,20,1),
				new THREE.MeshPhongMaterial({color: 0x787878})
			)
			socket.castShadow = true;
			socket.receiveShadow = true;
			let angle = i*Math.PI*2/this.trainers.length + 3*Math.PI/4;
			base.add(socket)
			base.position.set(
				this.radius*Math.cos(angle),
				10,
				this.radius*Math.sin(angle),
			)
			base.lookAt(0,0,0)
			this.trainerBases.add(base);
		})
		this.mesh.add(this.trainerBases);
	}
	addPacratcher(){
		this.trainers.forEach((t,i) => {
			if(!t.defeated){
				let base = this.trainerBases.children[i];
				base.add(t.activePacratcher.mesh)
			}
		})
	}
}
