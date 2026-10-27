# kpzls

A small puzzle site for children, starting with a four-tile loop puzzle.

## Run locally

Requires Node 24.3+ and pnpm 11.20.0.

```sh
pnpm install
pnpm dev
```

Open http://localhost:8787. This prototype builds once before starting Wrangler.
After editing, run `pnpm build` in another terminal; Wrangler reloads the Worker.
There is no component HMR integration yet.

```sh
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

## Stack and deployment

- Remix v3 server rendering, with an independently hydrated puzzle board.
- TypeScript 7's native compiler (`tsc`), Prettier, Oxlint, and Vitest.
- SVG tiles, tap and keyboard controls, and CSS Modules.
- JSON puzzle definitions; browser-only localStorage for saved positions.
- Cloudflare Workers for HTML; Workers Static Assets for built browser files.

The official Remix starter uses a Node server and `remix/assets` to compile
browser assets on demand. Its compiler uses filesystem access, Oxc, and Lightning
CSS. That workflow has not been validated inside Workers. This prototype retains
Remix SSR and hydration while using Vite to compile assets before deployment.
It does not use React, React Router, or a custom asset-response exporter.

`pnpm build` first builds browser JS and CSS, then reads Vite's asset manifest
to embed the matching asset URLs into the Worker bundle. Both builds use the
same CSS Modules configuration so server and browser class names match.
The client-entry identifier is stable across the two bundles; its resolver maps
the single board to the browser entry. Additional interactive components will
need explicit registry entries.

To publish after configuring Cloudflare credentials:

```sh
pnpm deploy
```

Deployment has not been performed. Local Wrangler verification does not establish
that a live Cloudflare deployment has succeeded.

## Puzzle scope

`app/levels/first-loop.json` contains the initial two-by-two puzzle. The current
validator intentionally handles only that board with four elbow tiles; it is
not a general graph solver. Puzzle rules have no UI dependencies.

Future seeded pseudorandom generation with difficulty parameters should produce
the same puzzle definitions consumed by the renderer. Generation, larger boards,
Playwright, sound, accounts, and server persistence are deferred.

Saved positions use a versioned localStorage key. Malformed or unavailable storage
is ignored so the puzzle remains playable. Progress stays in this browser and can
be removed by clearing site data.
