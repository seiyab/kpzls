import { renderToStream } from 'remix/component/server';
import { Board } from './board';
import level from './levels/first-loop.json';
import styles from './board.module.css';
const entry = __CLIENT_ENTRY__;

export default {
  async fetch(request: Request): Promise<Response> {
    if (new URL(request.url).pathname !== '/')
      return new Response('Not found', { status: 404 });
    const stream = renderToStream(
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Little loops · kpzls</title>
          {entry.css?.map((href) => (
            <link key={href} rel="stylesheet" href={`/${href}`} />
          ))}
          <script type="module" src={`/${entry.file}`} />
        </head>
        <body>
          <main class={styles.page}>
            <p>Little loops</p>
            <h1 class={styles.heading}>{level.title}</h1>
            <p>Turn each piece. Make one loop.</p>
            <Board />
            <noscript>Enable JavaScript to turn the tiles.</noscript>
          </main>
        </body>
      </html>,
      {
        resolveClientEntry: () => ({
          href: `/${entry.file}`,
          exportName: 'Board',
        }),
      },
    );
    return new Response(stream, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  },
};
