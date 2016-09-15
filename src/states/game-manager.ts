import {TextureManager} from "../content/texture-manager"
import {RocketShip} from "../world/rocket"
import {Environment} from "../world/environment"
import {WorldManager} from "../managers/world-manager"

export class GameManager extends Phaser.State {
	private _textureManager:TextureManager;

	private _worldManager: WorldManager = null;

	private _groundPlane: PIXI.Graphics = null;
	private _debug: Phaser.Text = null;

	private _rocket: RocketShip = null;

	private _environment: Environment = new Environment();

	get environment(): Environment {
		return this._environment;
	}

	constructor() {
		super();
	}

	init() {
		
	}

	preload() {
		
	}

	create() {
		this._textureManager = new TextureManager(this);
		this._worldManager = new WorldManager(this.world);

		this._groundPlane = this.game.add.graphics(0, 0, this.world);

		this._groundPlane.beginFill(0x55bb00);
		this._groundPlane.drawRect(0, 0, 400, 500);
		this._groundPlane.endFill();

		var pad = this.game.add.sprite(this.game.width / 2 - 25, -55, this._textureManager.getTexture("landingPad"), this._groundPlane);

		this._rocket = new RocketShip(this);
		this._rocket.setFloorPosition(this.game.width / 2, -5);
		this._rocket.register();

		this.game.camera.bounds = null;

		this._debug = this.game.add.text(5, 5, "Hello", {fontSize: 12, fill: "#ff00ff"});
		this._debug.fixedToCamera = true;
	}

	update() {
		var rocketAlt = Phaser.Math.clamp(this._rocket.altitude, 0, this._environment.atmosphere.height);
		this.game.stage.backgroundColor = Phaser.Color.interpolateColor(0x55ccff, 0x000000, this._environment.atmosphere.height, rocketAlt, 1);

		this._worldManager.update(this.game.time.elapsed / 1000);

		if (this._rocket.y <= 300) {
			this._rocket.cameraFollow(this.camera);
		} 

		this._debug.setText(`Velocity: ${Phaser.Math.roundTo(this._rocket.velocity.getMagnitude(), -2)} (${Phaser.Math.roundTo(this._rocket.velocity.x, -2)}, ${Phaser.Math.roundTo(this._rocket.velocity.y, -2)})\nAcceleration: ${Phaser.Math.roundTo(this._rocket.acceleration.x, -2)}, ${Phaser.Math.roundTo(this._rocket.acceleration.y, -2)}\nThrust: ${Phaser.Math.roundTo(this._rocket.thrust.x, -2)}, ${Phaser.Math.roundTo(this._rocket.thrust.y, -2)}\nAltitude: ${Phaser.Math.roundTo(this._rocket.altitude, -2)}\nFuel: ${Phaser.Math.roundTo(this._rocket.fuel, -2)}`);
	}

	getTexture(name: string): PIXI.RenderTexture {
		return this._textureManager.getTexture(name);
	}
}