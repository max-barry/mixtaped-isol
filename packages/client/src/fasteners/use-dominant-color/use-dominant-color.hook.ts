/**
 * Take a URL path to an image and return the dominant colors.
 * Off-thread this because it's a labor intensive process.
 *
 * @author Max Barry <@max-barry>
 * @since May 2020
 */
import { useEffect } from "react";

import Vibrant from "node-vibrant";
import { useSnapshot } from "valtio";

import { useLazyModule } from "../use-lazy-module";
import {
  DEFAULT_PALETTE_UNRESOLVED,
  PaletteCacheDatastore,
  PaletteResolved,
  setPaletteInCache,
  setPaletteUnresolved
} from "../../datastores/datastore.palette-cache";

/** Configuration options for node-vibrant */
const NODE_VIBRANT_OPTIONS: Partial<Vibrant["opts"]> = {
  quality: 5,
  colorCount: 64
};

export function useDominantColor(
  /** Source of image to palette pick from */
  src: string | null
) {
  /** Lazy load the node-vibrant library */
  const Vibrant = useLazyModule(() => import("node-vibrant"))?.default;

  /** Try to retrieve this value form the global cache on mount */
  const cachedPalette = useSnapshot(PaletteCacheDatastore)[src || ""];

  /** Each time we get a new src, we create an <img /> and analyze the palette */
  useEffect(() => {
    if (!Vibrant || cachedPalette || !src) return;

    /** Start the loading process */
    setPaletteUnresolved(src);

    /** Creat our promise with the controller attached */
    new Promise<{ src: string; palette: Omit<PaletteResolved, "resolved"> }>(
      resolve => {
        /** Create an image tag to house this src */
        const img = document.createElement("img");

        /** Set it's properties */
        img.src = src;
        img.crossOrigin = "Anonymous";

        /** Wait for this to load */
        img.addEventListener("load", () => {
          /** Create our instance of vibrant to analyze the loaded image */
          const vibrant = new Vibrant(img, NODE_VIBRANT_OPTIONS);

          /** Read the pallette */
          vibrant.getPalette().then(Palette => {
            /** Find the most dominant and 2nd most dominant non-muted colors (sorted by population) */
            const [dominant, accent, tertiary] = [
              Palette.DarkVibrant,
              Palette.LightVibrant,
              Palette.Vibrant
            ]
              .filter(Boolean)
              .sort((a, b) => (a && b ? b.population - a.population : 0));

            /** Save these to the state as hexes if we have some palettes */
            resolve({
              src,
              palette: {
                dominant: dominant?.hex,
                accent: accent?.hex,
                tertiary: tertiary?.hex,
                palette: Palette
              }
            });
          });
        });
      }
    ).then(({ src, palette }) => setPaletteInCache(src, palette));
  }, [Vibrant, cachedPalette, src]);

  return cachedPalette || DEFAULT_PALETTE_UNRESOLVED;
}
