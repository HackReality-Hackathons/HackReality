import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import icon from "astro-icon";

export default defineConfig({
  devOptions: {
    port: 4321,
  },
  integrations: [
    tailwind(),
    react(),
    icon({
      include: {
        mdi: ["*"] // Esto incluye todos los iconos de MDI
      }
    })
  ],
  vite: {
    define: {
      'import.meta.env.FIREBASE_API_KEY': JSON.stringify(process.env.PUBLIC_FIREBASE_API_KEY),
      'import.meta.env.PUBLIC_CROSSMINT_PROJECT_ID': JSON.stringify(process.env.PUBLIC_CROSSMINT_PROJECT_ID),
      'import.meta.env.PUBLIC_CROSSMINT_API_KEY': JSON.stringify(process.env.PUBLIC_CROSSMINT_API_KEY),
      'import.meta.env.MODE': JSON.stringify(process.env.MODE),
    },
    optimizeDeps: {
      include: ['firebase/app', 'firebase/auth']
    },
    envPrefix: ['PUBLIC_', 'VITE_']
  }
});