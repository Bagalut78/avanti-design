import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative Pfade: Die gebaute Musterseite läuft aus jedem Ordner (statische Seite).
  base: './',
  plugins: [react(), tailwindcss()],
  // Die Musterseite ist eine Vorführung in einem Paket (React, radix-ui, motion, lucide-react).
  build: { chunkSizeWarningLimit: 600 },
  resolve: {
    // Wie in der Registry: `@/ui/…` und `@/lib/…` (shadcn schreibt sie beim Einbau auf die
    // Aliase der App um).
    alias: [{ find: /^@\//, replacement: '/src/' }],
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    // Rohtext des Themas für die Token-Tests (src/lib/tokens.test.ts).
    css: { include: [/avanti\.css/] },
  },
});
