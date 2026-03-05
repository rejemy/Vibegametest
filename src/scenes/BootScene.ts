import Phaser from "phaser";

/**
 * BootScene — the first scene that runs when the game starts.
 *
 * Right now it just renders a title screen to confirm Phaser is working.
 * Later this will transition to a PreloadScene (loading assets) and then
 * the actual game scene.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  create(): void {
    const { width, height } = this.scale;

    // Background gradient rectangle (SNES-style deep blue)
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a2e);

    // Title text
    this.add
      .text(width / 2, height / 2 - 20, "VIBEGAME", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#ffffff",
        stroke: "#000033",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Subtitle / press start prompt
    this.add
      .text(width / 2, height / 2 + 16, "Phaser 3 + TypeScript", {
        fontFamily: "monospace",
        fontSize: "8px",
        color: "#aaaaff",
      })
      .setOrigin(0.5);

    // Blinking "tap to start" prompt
    const tapText = this.add
      .text(width / 2, height - 24, "TAP TO START", {
        fontFamily: "monospace",
        fontSize: "8px",
        color: "#ffff00",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: tapText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Framework version info (dev aid)
    this.add
      .text(4, height - 8, `Phaser ${Phaser.VERSION}`, {
        fontFamily: "monospace",
        fontSize: "6px",
        color: "#444444",
      })
      .setOrigin(0, 1);
  }
}
