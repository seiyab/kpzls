import { clientEntry, on, ref, type Handle } from 'remix/component';
import level from './levels/first-loop.json';
import { isLoop, rotate } from './puzzle';
import styles from './board.module.css';

const storageKey = `kpzls:v1:${level.id}`;

export const Board = clientEntry(
  'puzzle-board',
  function Board(handle: Handle) {
    let rotations = [...level.rotations];
    let restored = false;

    function save() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(rotations));
      } catch {
        /* Play remains available when storage is disabled. */
      }
    }

    function turn(index: number) {
      rotations[index] = rotate(rotations[index]);
      save();
      void handle.update();
    }

    return () => (
      <section
        mix={ref(() => {
          if (restored) return;
          restored = true;
          try {
            const saved: unknown = JSON.parse(
              localStorage.getItem(storageKey) ?? 'null',
            );
            if (
              Array.isArray(saved) &&
              saved.length === 4 &&
              saved.every(
                (value) => Number.isInteger(value) && value >= 0 && value < 4,
              )
            ) {
              rotations = saved;
              void handle.update();
            }
          } catch {
            /* Ignore invalid or unavailable local progress. */
          }
        })}
        aria-label="Loop puzzle"
      >
        <svg
          class={styles.board}
          viewBox="0 0 200 200"
          aria-label="Four tiles. Tap each tile to turn it clockwise."
        >
          {rotations.map((rotation, index) => (
            <g
              key={index}
              transform={`translate(${(index % level.size) * 100} ${Math.floor(index / level.size) * 100})`}
              role="button"
              tabindex={0}
              aria-label={`Turn tile ${index + 1}`}
              class={styles.tile}
              mix={[
                on('click', () => turn(index)),
                on('keydown', (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    turn(index);
                  }
                }),
              ]}
            >
              <rect x="3" y="3" width="94" height="94" rx="18" />
              <path
                class={styles.line}
                d="M 50 0 V 50 H 100"
                transform={`rotate(${rotation * 90} 50 50)`}
              />
            </g>
          ))}
        </svg>
        <p class={styles.status} role="status">
          {isLoop(rotations)
            ? 'You made a loop! ✨'
            : 'Tap the tiles to join the lines.'}
        </p>
        <button
          type="button"
          class={styles.reset}
          mix={on('click', () => {
            rotations = [...level.rotations];
            save();
            void handle.update();
          })}
        >
          Start again
        </button>
      </section>
    );
  },
);
