import {GameManager} from "../states/game-manager"
import {Controller} from "./controller"
import {Stage} from "./stage"
import {WorldObject} from "./world-object"
import {Debris} from "./debris"

export class RocketShip extends WorldObject {

	private _root: Stage = null;
	private _controller: Controller = null;

	private _stages: Stage[] = [];

	private _throttle: number = 0;
	private _pitch: number = 0;

	private _thrust: number = 50;

	private _hasCameraFollow: boolean = false;

	/** m/s2 */
	get thrust(): Phaser.Point {
		return this.thrustVector();
	}

	/** kg */
	get mass(): number {
		var current = this.currentStage();
		var amt = 0;

		current.forEach(stage => amt += stage.mass);
		return amt;
	}

	get fuel(): number {
		var current = this.currentStage();
		var amt = 0;

		if (current.length == 0) {
			return 0;
		}

		current.forEach((stage) => amt += stage.fuelPct);
		amt /= current.length;

		return amt;
	}

	constructor(game: GameManager) {
		super(game);

		this._controller = new Controller(this, this._game.game);
		this._velocity = new Phaser.Point(0, 0);

		this._group = this._game.game.add.group(null);

		//this._root = new Stage(this._game, this._group);
		this._stages.push(new Stage(this._game, this._group, {texture: "capsule", dryMass: 10, fuelMass: 0, thrust: 0}));
		this._stages.push(new Stage(this._game, this._group, {texture: "stagetwo", dryMass: 10, fuelMass: 10, thrust: 1000}));
		this._stages.push(new Stage(this._game, this._group, {texture: "rocket", dryMass: 30, fuelMass: 50, thrust: 5000}));

		// Position stages in simple stack, worry about CoM later
		var lastY: number = 0;
		for (var i = 0; i < this._stages.length; i++) {
			this._stages[i].setPosition(0, lastY);
			lastY += this._stages[i].height;
		}
	}

	/**
	 * Center the bottom of the rocket on the given position
	 * @param {number} x [description]
	 * @param {number} y [description]
	 */
	setFloorPosition(x: number, y: number) {
		var height = 0;
		this._stages.forEach(stage => height += stage.height);

		this._group.x = x;
		this._group.y = y - height;
	}

	update(delta: number) {
		this._controller.update(delta);

		var needStage: boolean = false;
		
		for (var i = 0; i < this._stages.length; i++) {
			if (!this._stages[i].update(delta)) {
				needStage = true;
			}
		}

		// KABOOM
		if (this.y >= 550) {
			return;
		}

		// Turn
		if (this._pitch != 0) {
			Phaser.Point.rotate(this._direction, 0, 0, this._pitch * 10 * delta, true);
			this._group.rotation = Math.atan2(this._direction.y, this._direction.x) + (Math.PI / 2);
		}

		super.update(delta);

		if (needStage) {
			this.stage();
		}
	}

	setThrottle(throttle: number) {
		this._throttle = throttle;
		
		var current = this.currentStage();
		current.forEach(stage => stage.throttle = throttle);

		if (throttle != 0) {
			this._holdGravity = false;
		}
	}

	setRotation(pitch: number) {
		this._pitch = pitch;
	}

	cameraFollow(camera: Phaser.Camera) {
		camera.y = this.y - camera.game.height / 2;
		camera.x = this.x - camera.game.width / 2;

		if (this._hasCameraFollow) {
			return;
		}

		//camera.focusOn(this._group);
		//camera.follow(this._root, null, 2);
		this._hasCameraFollow = true;
	}

	protected currentStage(): Stage[] {
		var stages: Stage[] = [];
		stages.push(this._stages[this._stages.length - 1]);
		return stages;
	}

	protected currentThrust(): number {
		var current = this.currentStage();
		var thrust = 0;
		current.forEach(stage => thrust += stage.thrust);

		return thrust;
	}

	protected thrustVector(): Phaser.Point {
		// TODO sum thrust of all active stages
		if (this.currentThrust() == 0) {
			return new Phaser.Point(0, 0);
		}

		// TODO a = m/f
		var direction = this._direction.clone().normalize();
		var force = this.currentThrust() / this.mass;
		direction.multiply(force, force);
		return direction;
	}

	protected stage() {
		var stage = this._stages.pop();
		this._group.removeChild(stage.root);
		
		var debris = new Debris(this._game, stage, this);
		debris.register();
	}
}