import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias:  {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path. resolve(__dirname, './src/shared'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/config': path. resolve(__dirname, './src/config'),
    },
  },
  
  server: {
    port: 3000,
    open: true,
  },
  
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks:  {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['zustand', '@tanstack/react-query'],
        },
      },
    },
  },
});