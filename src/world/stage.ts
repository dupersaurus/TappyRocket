import {GameManager} from "../states/game-manager"

export class Stage {

	private _sprite: Phaser.Sprite = null;

	private _dryMass: number = 20;

	/** Weight in kg */
	get mass(): number {
		return this._dryMass + this._fuel;
	}

	private _thrust: number = 0;

	/** Thrust produced by stage, in N */
	get thrust(): number {
		return this._fuel > 0 ? this._thrust * this._throttle : 0;
	}

	/** @type {number} Amount of fuel, in kg */
	private _fuel: number = 100;
	private _startFuel: number = 100;

	get fuelPct(): number {
		return this._fuel / this._startFuel;
	}

	get height(): number {
		return this._sprite ? this._sprite.height : 0;
	}

	private _throttle: number = 0;

	set throttle(value: number) {
		this._throttle = value;
	}

	constructor(private _game:GameManager, group: Phaser.Group, data: {texture: string, dryMass: number, fuelMass: number, thrust: number}) {
		var texture = _game.getTexture(data.texture);
		this._sprite = _game.game.add.sprite(texture.width * -0.5, texture.height * -0.5, texture, null, group);

		this._dryMass = data.dryMass;
		this._fuel = this._startFuel = data.fuelMass;
		this._thrust = data.thrust;
	}

	setPosition(x: number, y: number) {
		this._sprite.x = x;
		this._sprite.y = y;
	}

	update(delta: number): boolean {
		if (this._thrust == 0) {
			return true;
		}

		if (this._throttle > 0) {
			this._fuel -= 4 * delta;

			if (this._fuel <= 0) {
				return false;
			}
		}

		return true;
	}

	remove() {
		this._sprite.parent.removeChild(this._sprite);
		this._sprite.destroy(true);
	}
}