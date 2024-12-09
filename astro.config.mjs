import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import icon from "astro-icon";

export default defineConfig({
  devOptions: {
    port: 4321, // O cualquier otro puerto que prefieras
  },
  integrations: [
    tailwind(),
    react(),
    icon({
      include: {
        mdi: ["*"]
      }
    })
  ]
});