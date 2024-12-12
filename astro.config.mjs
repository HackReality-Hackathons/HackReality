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
        mdi: ["*"]
      }
    })
  ],
  vite: {
    define: {
      'process.env.FIREBASE_API_KEY': `"${process.env.PUBLIC_FIREBASE_API_KEY}"`,
      'process.env.PUBLIC_CROSSMINT_PROJECT_ID': `"${process.env.PUBLIC_CROSSMINT_PROJECT_ID}"`,
      'process.env.PUBLIC_CROSSMINT_API_KEY': `"${process.env.PUBLIC_CROSSMINT_API_KEY}"`,
      'process.env.MODE': `"${process.env.MODE}"`,
    },
    optimizeDeps: {
      include: ['firebase/app', 'firebase/auth']
    },
    // Asegurarse de que las variables de entorno están disponibles
    envPrefix: ['PUBLIC_', 'VITE_']
  }
});