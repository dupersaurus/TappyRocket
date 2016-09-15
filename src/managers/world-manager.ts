import {WorldObject} from "../world/world-object"

export class WorldManager {
	private static _instance: WorldManager;

	private _objects: WorldObject[] = [];

	constructor(private _world:Phaser.World) {
		WorldManager._instance = this;
	}

	update(delta: number) {
		this._objects.forEach(object => object.update(delta));
	}

	static add(object: WorldObject) {
		this._instance.addObject(object);
	}

	protected addObject(object: WorldObject) {
		for (var i = 0; i < this._objects.length; i++) {
			if (this._objects[i] == object) {
				return;
			}
		}

		this._objects.push(object);
		this._world.addChild(object.group);
	}

	static remove(object: WorldObject) {
		this._instance.removeObject(object);
	}

	protected removeObject(object: WorldObject) {
		var index = -1;

		for (var i = 0; i < this._objects.length; i++) {
			if (this._objects[i] == object) {
				index = i;
				break;
			}
		}

		if (i >= 0) {
			this._objects.splice(index, 1);
		}
	}
}