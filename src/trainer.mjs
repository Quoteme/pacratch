export class Trainer{
	/**
	 * Create a new trainer
	 * @param {string} name
	 * @param {Pacratch[]} deck - the deck of cards this trainer has available
	 * @param {Pacratch[]} hand - the cards the player has on his hand right now
	 * @param {Pacratch[]} active - the cards the player has on his hand right now
	 */
	constructor(name,deck,hand,active){
		// UI
		this._ui;
		this.initUI();
		// Values
		this.name   = name;
		this.health = 100;
		this.hp     = this.health;
		this.energy = 0;
		this.deck   = deck   ?? [];
		this.hand   = hand   ?? [];
		this.active = active ?? [];
	}

	/**
	 * Getter for health
	 */
	get health(){
		return this._health;
	}

	/**
	 * Setter for health
	 */
	set health(v){
		this._health = v;
		this._ui.health.total.innerText = v;
	}

	/**
	 * Getter for HP
	 */
	get hp(){
		return this._hp;
	}

	/**
	 * Setter for HP
	 */
	set hp(v){
		this._hp = v;
		this._ui.health.value.innerText = v;
	}

	/**
	 * Getter for energy
	 */
	get energy(){
		return this._nrg;
	}

	/**
	 * Setter for energy
	 */
	set energy(v){
		this._nrg = v;
		this._ui.energy.value.innerText = v;
	}

	/**
	 * Getter for name
	 */
	get name(){
		return this._name;
	}

	/**
	 * Setter for name
	 */
	set name(v){
		this._name = v;
		this._ui.name.innerText = v;
	}

	/**
	 * Getter for deck
	 */
	get deck(){
		return this._deck;
	}

	/**
	 * Setter for deck
	 */
	set deck(v){
		this._deck = v;
		this._ui.deck.value.innerText = v.length;
		this._ui.deck.total.innerText = v.length+v.used;
	}

	/**
	 * Trainer is defeated if he either has no pacratchers or all of
	 * them are defeated
	 */
	get defeated(){
		return this.pacratcher.every(p => p.defeated)
	}

	/**
	 * Returns the user interface as an HTML node
	 */
	get uiHTML(){
		return this._ui.container
	}

	/**
	 * Create a user interface which displays information about the
	 * trainer, like:
	 *
	 * - health
	 * - cards left in the deck
	 * - cards on the hand
	 * - cards currently active
	 */
	initUI(){
		// Creation
		this._ui = {
			container: document.createElement("div"),
			header: document.createElement("div"),
			name: document.createElement("span"),
			health: {
				container: document.createElement("div"),
				icon: new Image(),
				value: document.createElement("span"),
				total: document.createElement("span"),
			},
			deck: {
				container: document.createElement("div"),
				icon: new Image(),
				value: document.createElement("span"),
				total: document.createElement("span"),
			},
			energy: {
				container: document.createElement("div"),
				icon: new Image(),
				value: document.createElement("span"),
			},
			hand: document.createElement("div"),
			active: document.createElement("div"),
		};
		// Class lists
		this._ui.container.classList.add("trainerUI");
		this._ui.header.classList.add("header");
		this._ui.name.classList.add("name");
		this._ui.health.container.classList.add("health");
			this._ui.health.icon.classList.add("icon");
			this._ui.health.value.classList.add("value");
			this._ui.health.total.classList.add("total");
		this._ui.deck.container.classList.add("deck");
			this._ui.deck.icon.classList.add("icon");
			this._ui.deck.value.classList.add("value");
			this._ui.deck.total.classList.add("total");
		this._ui.energy.container.classList.add("energy");
			this._ui.energy.icon.classList.add("icon");
			this._ui.energy.value.classList.add("value");
		this._ui.hand.classList.add("hand");
		this._ui.active.classList.add("active");
		// Nesting
		this._ui.container.appendChild(this._ui.header);
			this._ui.header.appendChild(this._ui.name);
			this._ui.header.appendChild(this._ui.health.container);
				this._ui.health.container.appendChild(this._ui.health.icon);
				this._ui.health.container.appendChild(this._ui.health.value);
				this._ui.health.container.appendChild(this._ui.health.total);
			this._ui.header.appendChild(this._ui.deck.container);
				this._ui.deck.container.appendChild(this._ui.deck.icon);
				this._ui.deck.container.appendChild(this._ui.deck.value);
				this._ui.deck.container.appendChild(this._ui.deck.total);
			this._ui.header.appendChild(this._ui.energy.container);
				this._ui.energy.container.appendChild(this._ui.energy.icon);
				this._ui.energy.container.appendChild(this._ui.energy.value);
		this._ui.container.appendChild(this._ui.hand);
		this._ui.container.appendChild(this._ui.active);
		// Values
		this._ui.health.icon.src = "./res/icons/Herz.png";
		this._ui.deck.icon.src = "./res/icons/Kartendeck.png";
		this._ui.energy.icon.src = "./res/icons/Energie.png";
	}

	/**
	 * Pick cards from the deck into the hand
	 */
	pickCards(){
		// TODO
	}
	/**
	 * Start a new turn for this Trainer
	 */
	turn(){
		// TODO
	}
}
