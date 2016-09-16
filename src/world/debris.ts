import {GameManager} from "../states/game-manager"
import {WorldObject} from "./world-object"
import {RocketShip} from "./rocket"
import {Stage} from "./stage"

/**
 * A discarded stage
 */
export class Debris extends WorldObject {
	private _impulse: Phaser.Point = null;
	private _impulseTime: number = 0;

	constructor(game: GameManager, stage: Stage, parent: RocketShip) {
		super(game);

		this._group = this._game.game.add.group(null);

		var local = stage.localPos;
		var world = parent.position;
		local.rotate(0, 0, parent.rotation);
		world.add(local.x, local.y);

		this.setPosition(world.x, world.y);
		this._group.rotation = parent.rotation;

		this._velocity = parent.velocity.clone();
		this._impulse = this._velocity.clone().setMagnitude(1000);
		this._impulse.multiply(-1, -1);
		this._impulseTime = 1;

		game.add.sprite(0, 0, stage.root.texture, null, this._group);
		this._holdGravity = false;
	}

	update(delta: number) {
		super.update(delta);

		if (this._impulseTime > 0) {
			this._impulseTime -= delta;

			if (this._impulseTime <= 0) {
				this._impulse = new Phaser.Point(0, 0);
			}
		}
	}

	protected thrustVector(): Phaser.Point {
		return this._impulse;
	}
}