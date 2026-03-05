import Phaser from "phaser";
import { generatePlaceholderTextures } from "../utils/generateTextures";

/**
 * PreloadScene — loads (or generates) all game assets, then starts GameScene.
 *
 * TODO: When real assets are available, replace generatePlaceholderTextures()
 * with actual load calls in preload():
 *
 *   this.load.image('tileset', 'assets/tileset.png');
 *   this.load.spritesheet('player', 'assets/player.png', {
 *     frameWidth: 16, frameHeight: 16
 *   });
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload(): void {
    // Real asset loading goes here once files are in public/assets/
  }

  create(): void {
    const { width, height } = this.scale;

    // Generate placeholder textures programmatically
    generatePlaceholderTextures(this);

    // Brief "Loading…" display so the transition feels intentional
    this.add
      .text(width / 2, height / 2, "Loading...", {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    // Short delay then start game (gives the GPU a tick to upload textures)
    this.time.delayedCall(100, () => {
      this.scene.start("GameScene");
    });
  }
}
