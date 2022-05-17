/**
 * Cache for all of our programmatic color stealing.
 * @author Max Barry <@max-barry>
 */

import Vibrant from "node-vibrant";
import { proxy } from "valtio";

type VibrantPalette = NonNullable<Awaited<ReturnType<Vibrant["getPalette"]>>>;

interface Palette {
  dominant: string | undefined;
  accent: string | undefined;
  tertiary: string | undefined;
  palette: VibrantPalette | undefined;
}

export type PaletteResolved = {
  [K in keyof Palette]: Palette[K];
} & { resolved: true };

type PaletteUnresolved = {
  [K in keyof Palette]?: never;
} & { resolved: false };

export const DEFAULT_PALETTE_UNRESOLVED: PaletteUnresolved = {
  resolved: false
};

const initialPaletteCache: {
  [key: string]: PaletteResolved | PaletteUnresolved;
} = {};

export const PaletteCacheDatastore = proxy(initialPaletteCache);

/** Action to set the artwork in the color cache */
export const setPaletteInCache = (
  artwork: string,
  palette: Omit<Palette, "resolved">
) => (PaletteCacheDatastore[artwork] = { ...palette, resolved: true });

/** Action to set the artwork in the color cache */
export const setPaletteUnresolved = (artwork: string) =>
  (PaletteCacheDatastore[artwork] = DEFAULT_PALETTE_UNRESOLVED);
