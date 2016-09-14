import {Atmosphere} from "./atmosphere"
import {IGravityWell, ConstantGravity} from "./gravity"

export class Environment {
	private _atmosphere: Atmosphere = new Atmosphere(1.5, 120000);
	private _gravity:IGravityWell = new ConstantGravity(10);

	get atmosphere(): Atmosphere {
		return this._atmosphere;
	}

	get gravity(): IGravityWell {
		return this._gravity;
	}
}