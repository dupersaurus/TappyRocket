import {GameManager} from "../states/game-manager"

export class WorldObject {
	protected _group: Phaser.Group = null;

	protected _velocity: Phaser.Point = null;
	protected _acceleration: Phaser.Point = new Phaser.Point(0, 0);
	protected _direction: Phaser.Point = new Phaser.Point(0, -1);

	protected _holdGravity: boolean = true;

	/** x position */
	get x(): number {
		return this._group.x;
	}

	/** y position */
	get y(): number {
		return this._group.y;
	}

	/** Velocity, in m/s */
	get velocity(): Phaser.Point {
		return this._velocity;
	}

	/** Acceleration, in m/s2 */
	get acceleration(): Phaser.Point {
		return this._acceleration;
	}

	/** Altitude, in m */
	get altitude(): number {
		return -this.y;
	}

	/** kg */
	get mass(): number {
		return 1;
	}

	constructor(protected _game: GameManager) {
		
	}

	protected move(x: number, y: number) {
		this._group.x += x;
		this._group.y += y;
	}

	update(delta: number) {
		// Acceleration from thrust
		this._acceleration = this.thrustVector();

		// Acceleration from drag
		if (this._game.environment) {
			var drag = this._game.environment.atmosphere.dragForce(this.y, this._velocity, 0.1);
			//this._acceleration.add(drag.x, drag.y);
		}
		
		// Acceleration from gravity
		// TODO use collisions
		if (!this._holdGravity) {
			var gravity = this._game.environment.gravity.getGravityVector(new Phaser.Point(this.x, this.y), 0);
			this._acceleration.add(gravity.x, gravity.y);
		}
		
		this._acceleration.multiply(delta, delta);
		this._velocity = this._velocity.add(this._acceleration.x, this._acceleration.y);

		// Apply
		this.move(this._velocity.x * delta, this._velocity.y * delta);
	}

	protected thrustVector(): Phaser.Point {
		return new Phaser.Point(0, 0);
	}
}