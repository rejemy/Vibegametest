import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        // Split Phaser into its own chunk to keep game code separate
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
  server: {
    host: true, // expose on LAN so mobile devices on same network can connect
  },
});
