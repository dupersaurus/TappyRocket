import {RocketShip} from "./rocket"

export class Controller {
	private _pointer: Phaser.Pointer = null;

	constructor(private _rocket: RocketShip, private _game: Phaser.Game) {
		
	}

	update(delta: number) {
		if (this._game.input.activePointer.isDown) {
			this._rocket.setThrottle(1);

			var center = this._game.width / 2;
			var offcenter = Math.abs(this._game.input.activePointer.x - center);

			if (offcenter > 20) {
				offcenter -= 20;
				this._rocket.setRotation(Phaser.Math.clamp((center - 20) / offcenter, 0, 1));
			} else {
				this._rocket.setRotation(0);
			}
		} else {
			this._rocket.setThrottle(0);
			this._rocket.setRotation(0);
		}
	}
}