import { defineConfig } from "vite";
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        metronom: resolve(__dirname, 'metronom.html')
      }
    }
  },
  server: {
    open: '/index.html'
  }
});