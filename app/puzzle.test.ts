import { describe, expect, it } from 'vitest';
import { isLoop, rotate } from './puzzle';

describe('first loop', () => {
  it('closes only when all four elbows connect inside the board', () => {
    expect(isLoop([1, 2, 0, 3])).toBe(true);
    for (let index = 0; index < 4; index++) {
      const broken = [1, 2, 0, 3];
      broken[index] = rotate(broken[index]);
      expect(isLoop(broken)).toBe(false);
    }
    expect(isLoop([])).toBe(false);
  });

  it('returns a tile to its starting orientation after four taps', () => {
    expect(rotate(rotate(rotate(rotate(2))))).toBe(2);
  });
});
