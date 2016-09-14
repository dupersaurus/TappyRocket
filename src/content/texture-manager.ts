import {GameManager} from "../states/game-manager";

export class TextureManager {

	constructor(private _game: GameManager) {

	}

	getTexture(name:string): PIXI.RenderTexture {
		switch (name) {
			case "rocket":
				return this.drawRocket();

			case "stagetwo":
				return this.drawStageTwo();

			case "capsule":
				return this.drawCapsule();

			case "landingPad":
				return this.drawLandingPad();
			
			default:
				return null;
		}
	}

	private drawRocket(): PIXI.RenderTexture {
		var graphics = this._game.add.graphics(0, 0, this._game.world);

		graphics.beginFill(0xfff6d5);
		graphics.drawRect(-5, -30, 10, 30);
		graphics.endFill();

		var texture = graphics.generateTexture();
		this._game.world.remove(graphics, true);
		return texture;
	}

	private drawStageTwo(): PIXI.RenderTexture {
		var graphics = this._game.add.graphics(0, 0, this._game.world);

		graphics.beginFill(0xa5ffa5);
		graphics.drawRect(-5, -30, 10, 20);
		graphics.endFill();

		var texture = graphics.generateTexture();
		this._game.world.remove(graphics, true);
		return texture;
	}

	private drawCapsule(): PIXI.RenderTexture {
		var graphics = this._game.add.graphics(0, 0, this._game.world);

		graphics.beginFill(0xf6d5ff);

		graphics.drawPolygon([
					new Phaser.Point(0, 10),
					new Phaser.Point(10, 10),
					new Phaser.Point(8, 0),
					new Phaser.Point(2, 0)
				]);

		graphics.endFill();

		var texture = graphics.generateTexture();
		this._game.world.remove(graphics, true);
		return texture;
	}

	private drawLandingPad(): PIXI.RenderTexture {
		var graphics = this._game.add.graphics(0, 0, this._game.world);

		graphics.beginFill(0x999999);

		graphics.drawRect(0, 0, 40, 5);
		graphics.drawRect(3, -50, 6, 50);
		graphics.drawRect(3, -30, 15, 3);

		graphics.endFill();

		var texture = graphics.generateTexture();
		this._game.world.remove(graphics, true);
		return texture;
	}
}