import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import handlebars from 'vite-plugin-handlebars';
import { pageData } from './src/consts/';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src'),
  base: '/threejs-experiments/',
  plugins: [
    glsl(),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/templates'),
      context(pagePath) {
        const page = pageData.find((page) => page.path === pagePath);

        if (pagePath === '/index.html') {
          return {
            ...page,
            sketches: pageData.filter((page) => page.path !== '/index.html'),
          };
        }
        return page;
      },
      helpers: {
        eq: (a, b) => a === b,
      },
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        pageData.map((page) => [
          page.key,
          resolve(__dirname, `src${page.path}`),
        ]),
      ),
      output: {
        dir: resolve(__dirname, 'dist'),
      },
    },
  },
});
