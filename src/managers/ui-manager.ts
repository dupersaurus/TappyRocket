import {Atmosphere} from "../world/atmosphere"

export class UIManager {
	private _canvas: Phaser.Group = null;

	private _atmoDef: Atmosphere = null;

	private _atmosphere:Phaser.Sprite = null;
	private _ground: Phaser.Graphics = null;
	private _altitudeMarker: Phaser.Graphics = null;
	private _fuelMarker: Phaser.Graphics = null;

	constructor(private _game:Phaser.Game) {
		this._canvas = _game.add.group(_game.world);
		this._canvas.fixedToCamera = true;

		this._atmosphere = this._game.add.sprite(this._game.width - 20, 20, null, null, this._canvas);
		this._ground = this._game.add.graphics(this._game.width - 20, this._game.height - 30, this._canvas);

		this._altitudeMarker = _game.add.graphics(this._game.width - 20, 0, this._canvas);
		this._altitudeMarker.z = 100;
		this._altitudeMarker.beginFill(0xfff6d5);
		this._altitudeMarker.drawRect(-3, 0, 16, 3);
		this._altitudeMarker.endFill();

		this._fuelMarker = _game.add.graphics(_game.width / 2, 10, this._canvas);
	}

	setAtmosphere(atmosphere: Atmosphere) {
		this._atmoDef = atmosphere;

		var texture: Phaser.BitmapData = new Phaser.BitmapData(this._game, "atmosphere", 10, this._game.height - 50);
		//texture.beginLinearGradientFill([])
		
		var steps = 60;
		var stepHeight = texture.height / steps;

		for (var i = 0; i < steps; i++) {
			var c = Phaser.Color.interpolateColor(atmosphere.highColor, atmosphere.lowColor, steps, i);
			texture.rect(0, i * stepHeight, 10, Math.ceil(stepHeight), Phaser.Color.getWebRGB(c));
		}

		this._atmosphere.loadTexture(texture);

		this._ground.beginFill(0x55bb00);
		this._ground.drawRect(0, 0, 10, 10);
		this._ground.endFill();
		this._ground.y = 20 + steps * stepHeight;
	}

	setAltitude(altitude: number) {
		var pct = Phaser.Math.clamp(1 - altitude / this._atmoDef.height, 0, 1);
		this._altitudeMarker.y = 20 + this._atmosphere.texture.height * pct;
	}

	setFuelLevel(fuel: number) {
		this._fuelMarker.clear();

		var width = (this._game.width / 2 - 20) * fuel;

		this._fuelMarker.beginFill(0xfff6d5);
		this._fuelMarker.drawRect(-width, 0, width * 2, 5);
		this._fuelMarker.endFill();
	}
}