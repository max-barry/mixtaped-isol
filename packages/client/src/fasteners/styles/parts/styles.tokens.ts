import { css } from "@emotion/react";

type StyleTokenValues = string | number | string[];
type StyleTokenLibrary = Record<
  string,
  StyleTokenValues | Record<string, StyleTokenValues>
>;

/**
 * Colors used across the application.
 *
 * @see {@link https://uxdesign.cc/defining-colors-in-your-design-system-828148e6210a}
 * @see {@link http://colorbox.io/}
 */
const COLORS = {
  white: "white",
  text: { primary: "hsl(0, 0%, 0%, 0.8)", secondary: "hsl(0, 0%, 0%, 0.45)" },
  primary: {
    "05": "#fffaf7",
    "10": "#ffeee5",
    "90": "#fdc08f",
    "100": "#fbad5c", // base
    "110": "#c58405"
  },
  neutral: {
    "05": "#fafaff",
    "10": "#f1f1f7",
    "90": "#e0e0e7",
    "100": "#d8d7de",
    "110": "#c7c6ce"
  }
};

/** Radii */
const RADII = {
  media: 4
};

/**
 * box-shadows
 * @see {@link https://getcssscan.com/css-box-shadow-examples}
 */
const SHADOWS = {
  "05": "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
  "10": "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
  "15": "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
  "20": "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
  "25": "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
  "30": "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
  "35": "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px"
};

/**
 * Transition & animation easings
 */
const EASINGS = {
  "in-quad": "cubic-bezier(.55, .085, .68, .53)",
  "in-cubic": "cubic-bezier(.550, .055, .675, .19)",
  "in-quart": "cubic-bezier(.895, .03, .685, .22)",
  "in-quint": "cubic-bezier(.755, .05, .855, .06)",
  "in-expo": "cubic-bezier(.95, .05, .795, .035)",
  "in-circ": "cubic-bezier(.6, .04, .98, .335)",
  "out-quad": "cubic-bezier(.25, .46, .45, .94)",
  "out-cubic": "cubic-bezier(.215, .61, .355, 1)",
  "out-quart": "cubic-bezier(.165, .84, .44, 1)",
  "out-quint": "cubic-bezier(.23, 1, .32, 1)",
  "out-expo": "cubic-bezier(.19, 1, .22, 1)",
  "out-circ": "cubic-bezier(.075, .82, .165, 1)",
  "in-out-quad": "cubic-bezier(.455, .03, .515, .955)",
  "in-out-cubic": "cubic-bezier(.645, .045, .355, 1)",
  "in-out-quart": "cubic-bezier(.77, 0, .175, 1)",
  "in-out-quint": "cubic-bezier(.86, 0, .07, 1)",
  "in-out-expo": "cubic-bezier(1, 0, 0, 1)",
  "in-out-circ": "cubic-bezier(.785, .135, .15, .86)"
};

/** Convert our js tokens to css variables  */
export const cssTokens = css`
  :root {
    // color
    ${libraryToVariables("colors", "", COLORS)}
    // border-radius
    ${libraryToVariables("radii", "px", RADII)}
    // box-shadow
    ${libraryToVariables("shadows", "", SHADOWS)}
    // transition/animation
    ${libraryToVariables("ease", "", EASINGS)}
  }
`;

/**
 * Turns our theme variables into a bunch of CSS variables.
 *
 * @example
 *  libraryToVariables(colors)
 *  `--color-black: #2b2b2b;
 *   --color-grey-0: #B1B1B1;`
 *
 * @param lib Namespace to shroud this object in e.g. colors
 * @param obj Object that should be converted to vars
 * @param unit Suffixes the object's value with that unit e.g. ms will turn 100 into 100ms
 * @param namespace Namespace of the parent object when recursing e.g. "greys" within "colors"
 *
 * @author Max Barry <@max-barry>
 */
function libraryToVariables(
  lib: string,
  unit: string,
  obj: StyleTokenLibrary,
  namespace?: string
) {
  const s = ([key, value]) =>
    typeof value === "object"
      ? libraryToVariables(lib, unit, value, key)
      : `--${lib}-${namespace ? `${namespace}-` : ""}${key}: ${value}${unit};`;
  return Object.entries(obj).map(s).join("\n");
}
