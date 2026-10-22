import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  publicDir: 'public',
  envPrefix: ['VITE_', 'SUPABASE_'],
  server: {
    port: 3000,
    open: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});
