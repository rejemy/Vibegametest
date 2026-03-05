import Phaser from "phaser";
import { Player } from "../objects/Player";

// Map dimensions in tiles
const MAP_COLS = 32;
const MAP_ROWS = 32;
const TILE_SIZE = 16;

// Tile index legend (matches tileset generated in generateTextures.ts)
const T = {
  GRASS: 0,
  PATH: 1,
  WATER: 2,
  TREE: 3,
  ROCK: 4,
} as const;

/**
 * Builds the two-layer tilemap data arrays.
 *
 * ground  — walkable terrain (grass, path). Every cell filled.
 * objects — solid obstacles (water, trees, rocks). -1 = empty / passthrough.
 */
function buildMapData(): { ground: number[][]; objects: number[][] } {
  const ground: number[][] = Array.from({ length: MAP_ROWS }, () =>
    new Array(MAP_COLS).fill(T.GRASS)
  );
  const objects: number[][] = Array.from({ length: MAP_ROWS }, () =>
    new Array(MAP_COLS).fill(-1)
  );

  // --- Horizontal dirt path (rows 14–15) ---
  for (let c = 0; c < MAP_COLS; c++) {
    ground[14][c] = T.PATH;
    ground[15][c] = T.PATH;
  }

  // --- Vertical dirt path (cols 14–15) ---
  for (let r = 0; r < MAP_ROWS; r++) {
    ground[r][14] = T.PATH;
    ground[r][15] = T.PATH;
  }

  // --- Tree border (outer 2 rows/cols) ---
  for (let i = 0; i < MAP_COLS; i++) {
    objects[0][i] = T.TREE;
    objects[1][i] = T.TREE;
    objects[MAP_ROWS - 2][i] = T.TREE;
    objects[MAP_ROWS - 1][i] = T.TREE;
  }
  for (let i = 0; i < MAP_ROWS; i++) {
    objects[i][0] = T.TREE;
    objects[i][1] = T.TREE;
    objects[i][MAP_COLS - 2] = T.TREE;
    objects[i][MAP_COLS - 1] = T.TREE;
  }

  // Clear border trees on the paths (so player can reach the edge)
  for (let c = 14; c <= 15; c++) {
    objects[0][c] = -1;
    objects[1][c] = -1;
    objects[MAP_ROWS - 2][c] = -1;
    objects[MAP_ROWS - 1][c] = -1;
  }
  for (let r = 14; r <= 15; r++) {
    objects[r][0] = -1;
    objects[r][1] = -1;
    objects[r][MAP_COLS - 2] = -1;
    objects[r][MAP_COLS - 1] = -1;
  }

  // --- Pond (top-right area) ---
  for (let r = 4; r <= 9; r++) {
    for (let c = 20; c <= 26; c++) {
      objects[r][c] = T.WATER;
    }
  }

  // --- Interior tree clusters ---
  const treeTiles = [
    // Top-left grove
    [4, 4], [4, 5], [5, 4], [5, 5], [6, 4],
    // Top quadrant (above pond)
    [3, 20], [3, 21], [3, 22],
    // Bottom-left grove
    [22, 4], [22, 5], [23, 4],
    // Bottom-right cluster
    [20, 24], [21, 25], [22, 26],
    // Mid-left trees
    [10, 5], [10, 6], [11, 6],
    // Mid-right trees
    [10, 24], [11, 23], [11, 24],
    // Lower-mid cluster
    [19, 8], [20, 8], [20, 9],
  ];

  treeTiles.forEach(([r, c]) => {
    if (objects[r][c] === -1) objects[r][c] = T.TREE;
  });

  // --- Scattered rocks ---
  const rockTiles = [
    [7, 18], [8, 17], [12, 7], [13, 9], [18, 20], [19, 22],
    [24, 12], [25, 13], [6, 28], [7, 29], [21, 5],
  ];

  rockTiles.forEach(([r, c]) => {
    if (objects[r][c] === -1) objects[r][c] = T.ROCK;
  });

  return { ground, objects };
}

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private objectsLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    const { ground, objects } = buildMapData();

    // --- Build tilemap ---
    const map = this.make.tilemap({
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
      width: MAP_COLS,
      height: MAP_ROWS,
    });

    const tileset = map.addTilesetImage("tileset", undefined, TILE_SIZE, TILE_SIZE, 0, 0)!;

    // Ground layer (no collision)
    const groundLayer = map.createBlankLayer("ground", tileset)!;
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        groundLayer.putTileAt(ground[r][c], c, r);
      }
    }

    // Objects layer (solid tiles collide)
    this.objectsLayer = map.createBlankLayer("objects", tileset)!;
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        if (objects[r][c] !== -1) {
          this.objectsLayer.putTileAt(objects[r][c], c, r);
        }
      }
    }
    // Collide on every placed tile (all solid object types)
    this.objectsLayer.setCollisionByExclusion([-1]);

    // --- Player (spawns at crossroads centre) ---
    const spawnX = 15 * TILE_SIZE + TILE_SIZE / 2;
    const spawnY = 15 * TILE_SIZE + TILE_SIZE / 2;
    this.player = new Player(this, spawnX, spawnY);
    this.player.setDepth(1); // render above tiles

    // --- Physics: player vs solid tiles ---
    this.physics.add.collider(this.player, this.objectsLayer);

    // --- World + camera bounds ---
    const worldW = MAP_COLS * TILE_SIZE;
    const worldH = MAP_ROWS * TILE_SIZE;
    this.physics.world.setBounds(0, 0, worldW, worldH);
    this.player.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1); // 1:1 pixel mapping (256×224 viewport)
  }

  update(): void {
    this.player.update();
  }
}
