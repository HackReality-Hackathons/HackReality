import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    tailwind(),
    icon({
      include: {
        mdi: ["*"] // Esto incluirá todos los iconos de MDI
      }
    })
  ]
});