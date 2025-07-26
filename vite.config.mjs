import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react({
      include: 'src/**/*.{jsx,js,ts,tsx}',
    }),
    tailwindcss(),
  ],
  root: '.',
  build: {
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      // Add aliases to match the import paths used in the project
      app: path.resolve(__dirname, 'src', 'app'),
      api: path.resolve(__dirname, 'src', 'api'),
      // '..': 'DO NOT USE'
    },
  },
  server: {
    port: 3001, // Match the port used in the dev script
  },
});
