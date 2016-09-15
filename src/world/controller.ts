import {RocketShip} from "./rocket"

export class Controller {
	private _pointer: Phaser.Pointer = null;

	private _leftArea: Phaser.Rectangle = null;
	private _rightArea: Phaser.Rectangle = null;

	constructor(private _rocket: RocketShip, private _game: Phaser.Game) {
		var edgePad = 20;
		var centerPad = 20;
		var center = this._game.width / 2;

		this._leftArea = new Phaser.Rectangle(edgePad, 0, center - edgePad - centerPad, 1);
		this._rightArea = new Phaser.Rectangle(center + centerPad, 0, this._game.width - center - centerPad - edgePad, 1);
	}

	update(delta: number) {
		if (this._game.input.activePointer.isDown) {
			this._rocket.setThrottle(1);

			var rotation = 0;
			var pointer = this._game.input.activePointer.x;

			if (this._leftArea.contains(pointer, 0.5)) {
				rotation = -Phaser.Math.clamp((this._leftArea.right - pointer) / this._leftArea.width, 0, 1);
			} else if (this._rightArea.contains(pointer, 0.5)) {
				rotation = Phaser.Math.clamp((pointer - this._rightArea.left) / this._rightArea.width, 0, 1);
			}

			this._rocket.setRotation(rotation);
		} else {
			this._rocket.setThrottle(0);
			this._rocket.setRotation(0);
		}
	}
}