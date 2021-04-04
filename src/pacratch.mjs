import * as THREE from './three.module.js';

/**
 * Create a new Pacratch
 */
export class Pacratch{
	constructor(json){
		this.name        = json.name        ?? "no name";
		this.description = json.description ?? "";
		this.img         = json.img;
		this.width       = json.width;
		this.height      = json.height;
		this.health      = json.health      ?? 50;
		this._hp         = json.hp          ?? this.health;
		this.attacks     = json.attacks     ?? {};
		this.ap          = json.ap          ?? 0;
		this.accuracy    = json.accuracy    ?? 1.0;
		this.speed       = json.speed       ?? 1.0;
		this._geometry;
		this._material;
		this._texture;
		this._spriteMesh;
		this._healthbarMesh = new THREE.Object3D();
		this._healthbarMeshTotal;
		this._healthbarMeshAvailable;
		this.mesh = new THREE.Object3D();
		this.generateModel()
	}
	get hp(){
		return this._hp;
	}
	set hp(v){
		if( v>this.health )
			console.warn(`setting hp of ${this.name} above maximum health!`);
		else if( v<0 )
			v = 0
		this._hp = v;
		this.updateHealthbarMesh();
	}
	get defeated(){
		return this.hp<=0
	}
	/**
	 * Create a HTML div that contains all the information about this
	 * Pacratch and also acts like a menu
	 */
	get gameCard(){
		let container = document.createElement("div");
			container.classList.add("gameCard");
		let name = document.createElement("span");
			name.innerText = this.name;
			name.classList.add("name");
		let imageContainer = document.createElement("div");
			imageContainer.classList.add("imageContainer");
		let image = new Image();
			image.src = this.img;
			image.classList.add("portrait");
		imageContainer.appendChild(image);
		let description = document.createElement("p");
			description.innerText = this.description;
			description.classList.add("description");
		let attacks = document.createElement("ul");
			attacks.classList.add("attacks");
		Object.entries(this.attacks).forEach( ([name,info]) =>{
			let attack = document.createElement("li");
				attack.classList.add("attack");
			let title = document.createElement("span");
				title.innerText = name;
				title.classList.add("title");
				attack.appendChild(title);
			let information = document.createElement("ul");
				information.classList.add("information");
				attack.appendChild(information);
			let description = document.createElement("li");
				description.innerText = info.description;
				description.classList.add("description");
				information.appendChild(description);
			let stats = document.createElement("li")
				stats.classList.add("stats");
				information.appendChild(stats);
			let dmg = document.createElement("span");
				dmg.innerText = info.dmg ?? 0;
				dmg.classList.add("dmg");
				stats.appendChild(dmg);
			let speed = document.createElement("span");
				speed.innerText = info.speed ?? 0;
				speed.classList.add("speed");
				stats.appendChild(speed);
			let accuracy = document.createElement("span");
				accuracy.innerText = info.accuracy ?? 0;
				accuracy.classList.add("accuracy");
				stats.appendChild(accuracy);
			attacks.appendChild(attack);
		})
		let stats = document.createElement("div");
			stats.classList.add("stats");
		let speed = document.createElement("span");
			speed.innerText = this.speed;
			speed.classList.add("speed");
		stats.appendChild(speed);
		let accuracy = document.createElement("span");
			accuracy.innerText = this.accuracy;
			accuracy.classList.add("accuracy");
		stats.appendChild(accuracy);

		container.appendChild(name);
		container.appendChild(imageContainer);
		container.appendChild(description);
		container.appendChild(attacks);
		container.appendChild(stats);
		return container;
	}
	/**
	 * Updates the size of the health bar
	 */
	updateHealthbarMesh(){
		if( this._healthbarMeshAvailable != undefined ){
			this._healthbarMeshAvailable.scale.x = this.hp/this.health;
		}
	}
	/**
	 * Creates meshes for the healthbar
	 * This initializes the healthbar mesh
	 */
	generateHealthbarMesh(){
		this._healthbarMeshTotal = new THREE.Mesh(
			new THREE.BoxBufferGeometry(this.width,5,5,1,1,1),
			new THREE.MeshBasicMaterial({color: 0x880000})
		);
		this._healthbarMeshAvailable = new THREE.Mesh(
			new THREE.BoxBufferGeometry(this.width,10,10,1,1,1),
			new THREE.MeshBasicMaterial({color: 0xd70000})
		);
		this._healthbarMesh.add(this._healthbarMeshTotal);
		this._healthbarMesh.add(this._healthbarMeshAvailable);
		this._healthbarMesh.position.y = this.height + 15;
		this.updateHealthbarMesh()
	}
	/**
	 * Creates a mesh that is a plane with this pacratchers sprite as
	 * a texture
	 * This initializes the sprite mesh
	 */
	generateSpriteMesh(){
		this._texture  = new THREE.TextureLoader().load(this.img);
		this._texture.minFilter = THREE.LinearFilter;
		this._geometry = new THREE.PlaneBufferGeometry(
			this.width,this.height,10,10
		);
		this._material = new THREE.MeshBasicMaterial({
			map: this._texture,
			alphaTest: 0.5,
			transparent: true,
			side: THREE.DoubleSide,
		})
		this._spriteMesh = new THREE.Mesh(this._geometry,this._material);
		this._spriteMesh.position.y = this.height/2+10
		this._spriteMesh.castShadow = true
	}
	/**
	 * Initialize the mesh, which includes a healthbar, sprite, ...
	 */
	generateModel(){
		this.generateSpriteMesh();
		this.mesh.add(this._spriteMesh);
		this.generateHealthbarMesh();
		this.mesh.add(this._healthbarMesh);
	}
	/**
	 * Load a pacratcher from a json file
	 */
	static async fromJSONFile(url){
		let resp = await fetch(url)
		let json;
		if(resp.ok){
			json = await resp.json();
		}else{
			throw "JSON not found!"
		}
		return new Pacratch(json)
	}
}
