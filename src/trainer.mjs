export class Trainer{
	constructor(name,img,pacratcher){
		this.name = name;
		this.img  = img
		this.pacratcher = pacratcher;
	}
	/**
	 * Trainer is defeated if he either has no pacratchers or all of
	 * them are defeated
	 */
	get defeated(){
		return this.pacratcher.every(p => p.defeated)
	}
	get activePacratcher(){
		if(this.defeated)
			throw "defeated error";
		return this.pacratcher[0]
	}
}
