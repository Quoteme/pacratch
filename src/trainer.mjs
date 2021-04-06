export class Trainer{
	/**
	 * Create a new trainer
	 * @param {string} name
	 * @param {Pacratch[]} deck - the deck of cards this trainer has available
	 * @param {Pacratch[]} hand - the cards the player has on his hand right now
	 * @param {Pacratch[]} active - the cards the player has on his hand right now
	 */
	constructor(name,deck,hand,active){
		this.name   = name;
		this.health = 100;
		this._hp    = this.health;
		this.deck   = deck   ?? [];
		this.hand   = hand   ?? [];
		this.active = active ?? [];
	}
	/**
	 * Trainer is defeated if he either has no pacratchers or all of
	 * them are defeated
	 */
	get defeated(){
		return this.pacratcher.every(p => p.defeated)
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
	get ui(){
		let container = document.createElement("div");
			container.classList.add("trainerUI");
		return container;
	}
}
