import Phaser from "phaser";

type Direction = "down" | "left" | "right" | "up";

const SPEED = 80; // pixels per second

/**
 * Player — the controllable character.
 *
 * Spritesheet layout expected (16×16 per frame):
 *   Row 0: walk down  (frames 0–2)
 *   Row 1: walk left  (frames 3–5)
 *   Row 2: walk right (frames 6–8)
 *   Row 3: walk up    (frames 9–11)
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private facing: Direction = "down";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Collision box at feet area (bottom-centre of 16×16 sprite)
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(10, 6).setOffset(3, 10);

    this.createAnims(scene.anims);

    // Input
    this.cursors = scene.input.keyboard!.createCursorKeys();
    const kb = scene.input.keyboard!;
    this.wasd = {
      up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Start idle (paused on first frame of walk-down)
    this.play("walk-down");
    this.anims.pause(this.anims.currentAnim!.frames[0]);
  }

  private createAnims(anims: Phaser.Animations.AnimationManager): void {
    const directions: Direction[] = ["down", "left", "right", "up"];
    directions.forEach((dir, row) => {
      // Avoid re-creating if scene restarts
      if (anims.exists(`walk-${dir}`)) return;
      anims.create({
        key: `walk-${dir}`,
        frames: anims.generateFrameNumbers("player", {
          start: row * 3,
          end: row * 3 + 2,
        }),
        frameRate: 8,
        repeat: -1,
      });
    });
  }

  update(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const down = this.cursors.down.isDown || this.wasd.down.isDown;

    body.setVelocity(0, 0);

    if (left) {
      body.setVelocityX(-SPEED);
      this.facing = "left";
    } else if (right) {
      body.setVelocityX(SPEED);
      this.facing = "right";
    }

    if (up) {
      body.setVelocityY(-SPEED);
      this.facing = "up";
    } else if (down) {
      body.setVelocityY(SPEED);
      this.facing = "down";
    }

    const moving = left || right || up || down;

    if (moving) {
      // Normalise diagonal speed
      if ((left || right) && (up || down)) {
        body.velocity.normalize().scale(SPEED);
      }
      this.play(`walk-${this.facing}`, true);
    } else {
      // Freeze on the middle (idle) frame of the current direction
      this.anims.pause(this.anims.currentAnim!.frames[1]);
    }
  }
}
