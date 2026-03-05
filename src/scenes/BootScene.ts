import Phaser from "phaser";

/**
 * BootScene — title screen for Exar.
 * Waits for user input, then starts the PreloadScene.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  create(): void {
    const { width, height } = this.scale;

    // Dark background
    this.add.rectangle(width / 2, height / 2, width, height, 0x060614);

    // Stars (scattered dots)
    const starGfx = this.add.graphics();
    starGfx.fillStyle(0xffffff, 0.8);
    for (let i = 0; i < 60; i++) {
      const sx = Phaser.Math.Between(0, width);
      const sy = Phaser.Math.Between(0, height - 60);
      const size = Math.random() < 0.2 ? 2 : 1;
      starGfx.fillRect(sx, sy, size, size);
    }

    // Game title
    this.add
      .text(width / 2, height / 2 - 24, "EXAR", {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#e8d48b",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(width / 2, height / 2 + 8, "A TOP-DOWN ADVENTURE", {
        fontFamily: "monospace",
        fontSize: "7px",
        color: "#8898cc",
      })
      .setOrigin(0.5);

    // Blinking press-start prompt
    const prompt = this.add
      .text(width / 2, height - 28, "PRESS ANY KEY TO START", {
        fontFamily: "monospace",
        fontSize: "8px",
        color: "#ffff66",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Advance on any key or tap
    this.input.once("pointerdown", () => this.scene.start("PreloadScene"));
    this.input.keyboard?.once("keydown", () => this.scene.start("PreloadScene"));
  }
}
