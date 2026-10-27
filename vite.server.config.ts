import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(
  readFileSync(
    new URL('./dist/client/.vite/manifest.json', import.meta.url),
    'utf8',
  ),
);

export default defineConfig({
  define: { __CLIENT_ENTRY__: JSON.stringify(manifest['app/entry.ts']) },
  build: {
    ssr: 'app/server.tsx',
    outDir: 'dist/server',
    rollupOptions: { output: { entryFileNames: 'worker.js' } },
  },
  ssr: { target: 'webworker', noExternal: true },
});
