import {GameManager} from "../states/game-manager"
import {Controller} from "./controller"
import {Stage} from "./stage"

export class RocketShip {
	
	private _group: Phaser.Group = null;
	private _root: Stage = null;
	private _controller: Controller = null;

	private _stages: Stage[] = [];

	private _velocity: Phaser.Point = null;
	private _acceleration: Phaser.Point = new Phaser.Point(0, 0);

	private _direction: Phaser.Point = new Phaser.Point(0, -1);

	private _throttle: number = 0;
	private _pitch: number = 0;

	private _thrust: number = 50;

	private _hasCameraFollow: boolean = false;

	private _hasFired: boolean = false;

	get x(): number {
		return this._group.x;
	}

	get y(): number {
		return this._group.y;
	}

	get velocity(): Phaser.Point {
		return this._velocity;
	}

	get acceleration(): Phaser.Point {
		return this._acceleration;
	}

	/** m */
	get altitude(): number {
		return this.y;
	}

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

		current.forEach((stage) => amt += stage.fuelPct);
		amt /= current.length;

		return amt;
	}

	constructor(private _game: GameManager) {
		this._controller = new Controller(this, _game.game);
		this._velocity = new Phaser.Point(0, 0);

		this._group = _game.game.add.group(_game.world);

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

	setPosition(x: number, y: number) {
		this._group.x = x;
		this._group.y = y;// - this._root.height / 2;
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

	protected move(x: number, y: number) {
		this._group.x += x;
		this._group.y += y;
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

		// Acceleration from thrust
		this._acceleration = this.thrustVector();

		// Acceleration from drag
		if (this._game.environment) {
			var drag = this._game.environment.atmosphere.dragForce(this.y, this._velocity, 0.1);
			//this._acceleration.add(drag.x, drag.y);
		}

		// TODO acceleration from aerodynamic force
		
		// Acceleration from gravity
		// TODO use collisions
		if (this._hasFired) {
			var gravity = this._game.environment.gravity.getGravityVector(new Phaser.Point(this.x, this.y), 0);
			this._acceleration.add(gravity.x, gravity.y);
		}

		this._acceleration.multiply(delta, delta);

		this._velocity = this._velocity.add(this._acceleration.x, this._acceleration.y);

		// Apply
		this.move(this._velocity.x * delta, this._velocity.y * delta);

		if (needStage) {
			this.stage();
		}
	}

	setThrottle(throttle: number) {
		this._throttle = throttle;
		
		var current = this.currentStage();
		current.forEach(stage => stage.throttle = throttle);

		if (throttle != 0) {
			this._hasFired = true;
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
		stage.remove();
	}
}