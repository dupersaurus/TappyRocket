export class Atmosphere {

	/** @type {number} Density at sea level, kg/m3 */
	private _density: number = 0;

	/** @type {number} Max height of the atmosphere, m */
	private _height: number = 0;

	private _lowColor: number = 0x55ccff;
	private _highColor: number = 0x000000;

	get lowColor(): number {
		return this._lowColor;
	}

	get highColor(): number {
		return this._highColor;
	}

	constructor(density: number, height: number) {
		this._density = density;
		this._height = height;
	}

	get height(): number {
		return this._height;
	}

	getAltitudePct(altitude: number): number {
		return Phaser.Math.clamp(altitude / this._height, 0, 1);
	}

	getDensityAtHeight(altitude: number): number {
		return 1 - Math.pow(Phaser.Math.clamp(altitude / this._height, 0, 1), 2) * this._density;
	}

	dragForce(altitude: number, velocity: Phaser.Point, cod: number): Phaser.Point {
		var density = this.getDensityAtHeight(altitude);
		var drag = 0.5 * density * velocity.getMagnitudeSq() * 1 * cod;
		velocity = velocity.clone();

		return velocity.normalize().setMagnitude(-drag);
	}
}