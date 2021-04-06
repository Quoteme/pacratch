import * as THREE from './three.module.js';

/**
 * Create a new Pacratch
 */
export class Pacratch{
	constructor(json){
		this.name          = json.name                         ?? "no name";
		this.description   = json.description                  ?? "";
		this.img           = json.img;
		this.width         = json.width;
		this.height        = json.height;
		this.health        = json.health                       ?? 50;
		this._hp           = json.hp                           ?? this.health;
		this.summoningCost = json.summoningCost                ?? 3;
		this.turnCost      = json.turnCost                     ?? 1;
		this.attacks       = Attack.parseAttacks(json.attacks)
		this.nrg           = 0
		this.accuracy      = json.accuracy                     ?? 1.0;
		this.speed         = json.speed                        ?? 1.0;
		// POSITION
		this._x            = 0;
		this._y            = 0;
		this._z            = 0;
		this._card         = json.card                         ?? {};
		// THREEJS Scene stuff
		this._geometry;
		this._material;
		this._texture;
		this._spriteMesh;
		this._healthbarMesh = new THREE.Object3D();
		this._healthbarMeshTotal;
		this._healthbarMeshAvailable;
		this._socket;
		this.mesh = new THREE.Object3D();
		this.generateModel()
	}

	/**
	 * X-Position getter
	 * @returns {number}
	 */
	get x(){
		return this._x;
	}

	/**
	 * X-Position setter
	 * @param {number} nx
	 */
	set x(nx){
		this._x = nx;
		this.updatePosition();
	}

	/**
	 * Y-Position getter
	 * @returns {number}
	 */
	get y(){
		return this._y;
	}

	/**
	 * Y-Position setter
	 * @param {number} ny
	 */
	set y(ny){
		this._y = ny;
		this.updatePosition()
	}

	/**
	 * Z-Position getter
	 * @returns {number}
	 */
	get z(){
		return this._z;
	}

	/**
	 * Z-Position setter
	 * @param {number} nz
	 */
	set z(nz){
		this._z = nz;
		this.updatePosition()
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
	 * Update the position of the mesh in the arena
	 */
	updatePosition(){
		this.mesh.position.set(this.x,this.y,this.z);
	}

	/**
	 * Create a HTML div that contains all the information about this
	 * Pacratch and also acts like a menu
	 */
	get gameCard(){
		let container = document.createElement("div");
			container.classList.add("gameCard");
			container.style.borderColor = this._card?.borderColor
			container.style.background  = this._card?.background
		// TITLEBAR
		let titleBar = document.createElement("div");
			titleBar.classList.add("titleBar");
			container.appendChild(titleBar);
		let name = document.createElement("span");
			name.innerText = this.name;
			name.classList.add("name");
			titleBar.appendChild(name);
		let quickstatBar = document.createElement("span");
			quickstatBar.classList.add("quickstatBar");
			titleBar.appendChild(quickstatBar);
			// HEALTH
			let hp = document.createElement("span");
				hp.classList.add("hp");
				hp.innerText = this.hp;
				hp.title = "HP";
				quickstatBar.appendChild(hp);
			// SUMMONING COSTS
			let summoningCost = document.createElement("span");
				summoningCost.classList.add("summoningCost");
				summoningCost.innerText = this.summoningCost;
				summoningCost.title = "Summoning cost - Energy required for summoning";
				quickstatBar.appendChild(summoningCost);
			// TURN COSTS
			let turnCost = document.createElement("span");
				turnCost.classList.add("turnCost");
				turnCost.innerText = this.turnCost;
				turnCost.title = "Turn cost - Energy required for maintanance each turn";
				quickstatBar.appendChild(turnCost);
		// IMAGE
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
		this.attacks.forEach( atk => attacks.appendChild(atk.html))
		// GENERAL STATISTICS
		let stats = document.createElement("div");
			stats.classList.add("stats");
			// SPEED
			let speed = document.createElement("div");
				speed.classList.add("speed");
			let speedIcon = new Image();
				speedIcon.src = this._card?.icons?.speed
					?? "./res/icons/Schuh.png";
				speedIcon.classList.add("icon");
				speed.appendChild(speedIcon)
			let speedValue = document.createElement("span");
				speedValue.innerText = this.speed;
				speed.appendChild(speedValue)
				stats.appendChild(speed);
			// ACCURACY
			let accuracy = document.createElement("div");
				accuracy.classList.add("accuracy");
			let accuracyIcon = new Image();
				accuracyIcon.src = this._card?.icons?.accuracy
					?? "./res/icons/Ziel.png";
				accuracyIcon.classList.add("icon");
				accuracy.appendChild(accuracyIcon)
			let accuracyValue = document.createElement("span");
				accuracyValue.innerText = this.accuracy;
				accuracy.appendChild(accuracyValue)
				stats.appendChild(accuracy);
			stats.appendChild(accuracy);

		container.appendChild(titleBar);
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
	 * Create a socket for the pacratch to stay on
	 */
	generateSocket(){
		this._socket = new THREE.Mesh(
			new THREE.CylinderBufferGeometry(80,70,30,20,1),
			new THREE.MeshPhongMaterial({color: 0x787878})
		)
		this._socket.castShadow = true;
		this._socket.receiveShadow = true;
	}

	/**
	 * Initialize the mesh, which includes a healthbar, sprite, ...
	 */
	generateModel(){
		this.generateSocket();
		this.mesh.add(this._socket);
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

class Attack{
	/**
	 * Create a new attack based on json information
	 *
	 * @param {String} json.name - name of the attack
	 * @param {String} json.description - description of the attack
	 * @param {number} json.dmg - damage dealt by this attack
	 * @param {number} json.accuracy - Chance of hitting between 0% and 100%
	 * @param {number} json.nrg - Energy needed by this attack
	 */
	constructor(json){
		this.name = json.name ?? "Attack name";
		this.description = json.description ?? "Attack description";
		this.dmg = json.dmg ?? 10;
		this.accuracy = json.accuracy ?? 1.0;
		this.nrg = json.nrg ?? 3;
	}

	/**
	 * Display information about this attack in HTML format
	 */
	get html(){
		let attack = document.createElement("li");
			attack.classList.add("attack");
		// NAME
		let title = document.createElement("span");
			title.innerText = this.name;
			title.classList.add("title");
			attack.appendChild(title);
		let information = document.createElement("ul");
			information.classList.add("information");
			attack.appendChild(information);
		// DESCRIPTION
		let description = document.createElement("li");
			description.innerText = this.description;
			description.classList.add("description");
			information.appendChild(description);
		// STATS
		let stats = document.createElement("li")
			stats.classList.add("stats");
			information.appendChild(stats);
		// ENERGY
		let nrg = document.createElement("div");
			nrg.classList.add("nrg");
		let nrgIcon = new Image();
			nrgIcon.src = this._card?.icons?.nrg
				?? "./res/icons/Energie.png";
			nrgIcon.classList.add("icon");
			for(let i=0; i<this.nrg; i++) {
				nrg.appendChild(nrgIcon.cloneNode(true))
			}
		// let nrgValue = document.createElement("span");
		// 	nrgValue.innerText = this.nrg ?? 0;
		// 	nrg.appendChild(nrgValue)
			stats.appendChild(nrg);
		// DAMAGE
		let dmg = document.createElement("div");
			dmg.classList.add("dmg");
		let dmgIcon = new Image();
			dmgIcon.src = this._card?.icons?.dmg
				?? "./res/icons/Schwert.png";
			dmgIcon.classList.add("icon");
			dmg.appendChild(dmgIcon)
		let dmgValue = document.createElement("span");
			dmgValue.innerText = this.dmg ?? 0;
			dmg.appendChild(dmgValue)
			stats.appendChild(dmg);
		// ACCURACY
		let accuracy = document.createElement("div");
			accuracy.classList.add("accuracy");
		let accuracyIcon = new Image();
			accuracyIcon.src = this._card?.icons?.accuracy
				?? "./res/icons/Ziel.png";
			accuracyIcon.classList.add("icon");
			accuracy.appendChild(accuracyIcon)
		let accuracyValue = document.createElement("span");
			accuracyValue.innerText = this.accuracy ?? 0;
			accuracy.appendChild(accuracyValue)
			stats.appendChild(accuracy);
		return attack
	}

	/**
	 * Parse a list of json data about attacks into a list of attacksattacks
	 * @param {Object[]} attacks
	 * @returns {Attack[]}
	 */
	static parseAttacks(attacks){
		if(attacks==undefined)
			return []
		return attacks.map(a => new Attack(a))
	}
}
