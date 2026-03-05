import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { GameScene } from "./scenes/GameScene";

// SNES native resolution: 256x224
// We render at this resolution and let Phaser scale up to fill the screen.
const GAME_WIDTH = 256;
const GAME_HEIGHT = 224;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL with Canvas fallback
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "game-container",
  backgroundColor: "#000000",
  pixelArt: true, // disable anti-aliasing for crisp pixel art
  scale: {
    mode: Phaser.Scale.FIT, // scale to fill screen, maintain aspect ratio
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, PreloadScene, GameScene],
};

new Phaser.Game(config);
