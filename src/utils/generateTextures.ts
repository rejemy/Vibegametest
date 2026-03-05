import Phaser from "phaser";

/**
 * Generates placeholder textures using Phaser's Graphics API.
 *
 * TODO: When real assets are available, remove these calls from PreloadScene
 * and instead load the real files:
 *   this.load.image('tileset', 'assets/tileset.png');
 *   this.load.spritesheet('player', 'assets/player.png', { frameWidth: 16, frameHeight: 16 });
 *
 * Expected real asset layout:
 *   tileset.png — 16×16 tile grid (ArMM1998 Zelda-like pack)
 *   player.png  — 48×64 spritesheet (3 frames × 4 directions, each 16×16)
 *                 Row 0: walk down, Row 1: walk left, Row 2: walk right, Row 3: walk up
 */
export function generatePlaceholderTextures(scene: Phaser.Scene): void {
  genTileset(scene);
  genPlayerSheet(scene);
}

/**
 * Tileset — 80×16 px (5 tiles × 1 row, each 16×16)
 *
 * Tile index → type:
 *   0 = Grass  (walkable)
 *   1 = Path   (walkable)
 *   2 = Water  (solid)
 *   3 = Tree   (solid)
 *   4 = Rock   (solid)
 */
function genTileset(scene: Phaser.Scene): void {
  const T = 16;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  // 0: Grass
  g.fillStyle(0x3d7a30);
  g.fillRect(0, 0, T, T);
  g.fillStyle(0x4a9040);
  g.fillRect(2, 3, 3, 3);
  g.fillStyle(0x2e6020);
  g.fillRect(9, 9, 4, 3);
  g.fillStyle(0x4a9040);
  g.fillRect(12, 2, 2, 4);

  // 1: Path / dirt
  g.fillStyle(0xb8965a);
  g.fillRect(T, 0, T, T);
  g.fillStyle(0xa07840);
  g.fillRect(T + 1, 2, 4, 4);
  g.fillStyle(0xc8a870);
  g.fillRect(T + 9, 9, 5, 3);

  // 2: Water
  g.fillStyle(0x1a60cc);
  g.fillRect(T * 2, 0, T, T);
  g.fillStyle(0x2a70dc);
  g.fillRect(T * 2 + 2, 4, 10, 3);
  g.fillStyle(0x2a70dc);
  g.fillRect(T * 2 + 1, 10, 12, 3);

  // 3: Tree (solid)
  g.fillStyle(0x1e5c18);
  g.fillRect(T * 3, 0, T, T);
  g.fillStyle(0x2a7a22);
  g.fillRect(T * 3 + 2, 1, 12, 9);
  g.fillStyle(0x3a9030);
  g.fillRect(T * 3 + 4, 2, 8, 6);
  g.fillStyle(0x6b4226);
  g.fillRect(T * 3 + 6, 11, 4, 5);

  // 4: Rock (solid)
  g.fillStyle(0x777777);
  g.fillRect(T * 4, 0, T, T);
  g.fillStyle(0x606060);
  g.fillRect(T * 4 + 2, 3, 12, 9);
  g.fillStyle(0xaaaaaa);
  g.fillRect(T * 4 + 3, 4, 5, 4);
  g.fillStyle(0x555555);
  g.fillRect(T * 4 + 9, 8, 3, 3);

  g.generateTexture("tileset", T * 5, T);
  g.destroy();
}

/**
 * Player spritesheet — 48×64 px (3 frames × 4 directions, each 16×16)
 *
 * Frame layout:
 *   Rows:    0=down, 1=left, 2=right, 3=up
 *   Columns: 0=idle, 1=step-left, 2=step-right
 */
function genPlayerSheet(scene: Phaser.Scene): void {
  const W = 16,
    H = 16;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  for (let dir = 0; dir < 4; dir++) {
    for (let frame = 0; frame < 3; frame++) {
      const px = frame * W;
      const py = dir * H;

      // Leg bob offset for walking frames
      const lOff = frame === 1 ? -1 : 0; // left leg
      const rOff = frame === 2 ? -1 : 0; // right leg

      // Legs (dark blue trousers)
      g.fillStyle(0x1a3080);
      g.fillRect(px + 4, py + 10 + lOff, 3, 5);
      g.fillRect(px + 9, py + 10 + rOff, 3, 5);

      // Boots
      g.fillStyle(0x3a1a00);
      g.fillRect(px + 3, py + 13 + lOff, 4, 3);
      g.fillRect(px + 9, py + 13 + rOff, 4, 3);

      // Tunic / body (green, Zelda-like)
      g.fillStyle(0x2e7a2e);
      g.fillRect(px + 3, py + 6, 10, 6);

      // Belt
      g.fillStyle(0x5a3010);
      g.fillRect(px + 3, py + 11, 10, 1);

      // Skin (head + hands)
      g.fillStyle(0xf5c096);
      g.fillRect(px + 4, py + 2, 8, 6);

      // Hat (green pointy Zelda hat)
      g.fillStyle(0x2e7a2e);
      g.fillRect(px + 4, py + 1, 8, 3); // brim
      g.fillRect(px + 5, py + 0, 6, 2); // mid
      g.fillRect(px + 6, py + 0, 4, 1); // tip

      // Face details (direction-specific)
      g.fillStyle(0x303030);
      if (dir === 0) {
        // Facing down — two eyes visible
        g.fillRect(px + 6, py + 5, 1, 1);
        g.fillRect(px + 9, py + 5, 1, 1);
      } else if (dir === 1) {
        // Facing left — one eye
        g.fillRect(px + 5, py + 5, 1, 1);
      } else if (dir === 2) {
        // Facing right — one eye
        g.fillRect(px + 10, py + 5, 1, 1);
      }
      // dir === 3 (up) — back of head, no face
    }
  }

  g.generateTexture("player", W * 3, H * 4);
  g.destroy();
}
