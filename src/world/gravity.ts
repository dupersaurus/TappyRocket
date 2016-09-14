export interface IGravityWell {
	getGravityVector(position: Phaser.Point, mass: number): Phaser.Point;
}

/**
 * A simplification of gravity model where the gravity vector is always screen (positive-y) down
 */
export class ConstantGravity implements IGravityWell {
	/** Acceleration in m/s2 */
	constructor(private _acceleration: number) { }

	getGravityVector(position: Phaser.Point, mass: number): Phaser.Point {
		return new Phaser.Point(0, this._acceleration);
	}
}