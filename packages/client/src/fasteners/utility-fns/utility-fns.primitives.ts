/**
 * Direct implementation of lodash.clamp
 * @see {@link https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L13981}
 */
export function clamp(
  /** The value to clamp */
  number: number,
  /** The smallest number the value is allowed to be */
  lower: number | undefined,
  /** The largest number the value is allowed to be */
  upper: number | undefined
) {
  if (upper === undefined) {
    upper = lower;
    lower = undefined;
  }

  // eslint-disable-next-line no-self-compare
  if (upper !== undefined) upper = upper === upper ? upper : 0;
  // eslint-disable-next-line no-self-compare
  if (lower !== undefined) lower = lower === lower ? lower : 0;

  return baseClamp(number, lower, upper);
}

/**
 * Direct implementation of lodash.baseClamp
 * @see {@link https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L13981}
 */
function baseClamp(
  number: number,
  lower: number | undefined,
  upper: number | undefined
) {
  // eslint-disable-next-line no-self-compare
  if (number === number) {
    if (upper !== undefined) number = number <= upper ? number : upper;
    if (lower !== undefined) number = number >= lower ? number : lower;
  }
  return number;
}

/**
 * Moves an array item from one position in an array to another.
 *
 * Direct implementation of lodash-move's move function.
 *
 * @see {@link https://github.com/granteagon/move/blob/master/src/index.js}
 */
export function swap<T extends any>(
  array: T[],
  moveIndex: number,
  toIndex: number
) {
  const item = array[moveIndex];
  const length = array.length;
  const diff = moveIndex - toIndex;

  if (diff > 0) {
    /** To the left... */
    return [
      ...array.slice(0, toIndex),
      item,
      ...array.slice(toIndex, moveIndex),
      ...array.slice(moveIndex + 1, length)
    ];
  } else if (diff < 0) {
    /** To the right... */
    const targetIndex = toIndex + 1;
    return [
      ...array.slice(0, moveIndex),
      ...array.slice(moveIndex + 1, targetIndex),
      item,
      ...array.slice(targetIndex, length)
    ];
  }
  return array;
}

/** Fast shuffle an array */
export function shuffle<T>(arr: T[]) {
  return arr.sort(() => 0.5 - Math.random());
}
