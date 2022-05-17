import { HTMLProps } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Rhythm from "compass-vertical-rhythm";

import { PUBLIC_URL } from "../../../configuration";

type AvailableWeightFlags = "regular" | "medium" | "bold";
type AvailableColorFlags = "primary" | "secondary";

type TypesettingProps = {
  weight?: AvailableWeightFlags;
  color?: AvailableColorFlags;
} & HTMLProps<HTMLHeadingElement | HTMLParagraphElement>;

/**
 * ----------------------
 * Type related constants
 * @see {@link https://www.gridlover.net/try}
 * ----------------------
 */
const TYPE_DIRECTORY = `${PUBLIC_URL}/typefaces`;
const TYPE_FONT_NAME_SANS = "xxipmmvzcb";
const TYPE_FAMILIES_SANS = [TYPE_FONT_NAME_SANS, "sans-serif"].join(",");

const TYPE_BASE_FONT_SIZE = 16;
const TYPE_BASE_FONT_SIZE_PX = `${TYPE_BASE_FONT_SIZE}px`;
const TYPE_BASE_LINE_HEIGHT = 1.4;
const TYPE_BASE_SCALE = 1.875;

const FONT_WEIGHT_REGULAR = 400;
const FONT_WEIGHT_MEDIUM = 500;
const FONT_WEIGHT_BOLD = 700;

const FONT_WEIGHT_HUMAN_MAP: { [K in AvailableWeightFlags]: number } = {
  regular: FONT_WEIGHT_REGULAR,
  medium: FONT_WEIGHT_MEDIUM,
  bold: FONT_WEIGHT_BOLD
};

/**
 * --------------------------------
 * Useful rhythm weighting function
 * --------------------------------
 */
export const { rhythm } = Rhythm({
  baseFontSize: TYPE_BASE_FONT_SIZE_PX,
  baseLineHeight: TYPE_BASE_LINE_HEIGHT
});

/**
 * -----------------------------
 * Low level type related resets
 * -----------------------------
 */
export const typographicStyles = css`
  html,
  body {
    font-family: ${TYPE_FAMILIES_SANS};
    font-size: ${TYPE_BASE_FONT_SIZE_PX};
    line-height: ${rhythm(1)};
    color: var(--colors-text-primary);
    text-rendering: optimizeLegibility;
    font-smooth: always;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }

  ${generateFontFace(FONT_WEIGHT_REGULAR, "regular")};
  ${generateFontFace(FONT_WEIGHT_MEDIUM, "medium")};
  ${generateFontFace(FONT_WEIGHT_BOLD, "bold")};
  ${generateFontFace(FONT_WEIGHT_REGULAR, "regular", "italic")};
  ${generateFontFace(FONT_WEIGHT_MEDIUM, "medium", "italic")};
  ${generateFontFace(FONT_WEIGHT_BOLD, "bold", "italic")};
`;

/**
 * ----------------------------------------------------------------
 * Basic styled component all headings and paragraphs can build off
 * ----------------------------------------------------------------
 */
const Typesetting = styled.p<TypesettingProps>`
  font-weight: ${({ weight = "regular" }) => FONT_WEIGHT_HUMAN_MAP[weight]};
  color: ${({ color = "primary" }) => `var(--colors-text-${color})`};
`;

/**
 * ---------------------------------------------------------------
 * Some rudimentary type styles and corresponding React components
 * ---------------------------------------------------------------
 */
const { pow, ceil } = Math;

export const headingOne = css`
  font-size: ${TYPE_BASE_FONT_SIZE * pow(TYPE_BASE_SCALE, 3)}px;
  line-height: ${rhythm(4)};
`;

export const headingTwo = css`
  font-size: ${TYPE_BASE_FONT_SIZE * pow(TYPE_BASE_SCALE, 2)}px;
  line-height: ${rhythm(3)};
`;

export const headingThree = css`
  font-size: ${TYPE_BASE_FONT_SIZE * pow(TYPE_BASE_SCALE, 1)}px;
  line-height: ${rhythm(2)};
`;

export const paragraph = css`
  font-size: ${TYPE_BASE_FONT_SIZE}px;
  line-height: ${rhythm(1)};
`;

export const caption = css`
  font-size: ${ceil(TYPE_BASE_FONT_SIZE * pow(TYPE_BASE_SCALE, -1 / 2))}px;
  line-height: ${rhythm(1)};
`;

export const HeadingOne = styled(Typesetting)`
  ${headingOne};
`;

export const HeadingTwo = styled(Typesetting)`
  ${headingTwo};
`;

export const HeadingThree = styled(Typesetting)`
  ${headingThree};
`;

export const Paragraph = styled(Typesetting)`
  ${paragraph};
`;

export const Caption = styled(Typesetting)`
  ${caption};
`;

/**
 * Take rem and convert to px
 * @author Max Barry <@max-barry>
 */
export function remToPx(rem: string) {
  return parseInt(rem.replace("rem", "")) * TYPE_BASE_FONT_SIZE;
}

/**
 * Utility to quickly generate font-face strings
 * @author Max Barry <@max-barry>
 */
function generateFontFace(
  fontWeight: number,
  fontFileSuffix: string,
  fontStyle: "normal" | "italic" = "normal",
  fontName = TYPE_FONT_NAME_SANS
) {
  return `
  @font-face {
    font-family: ${fontName};
    src: url("${TYPE_DIRECTORY}/${fontName}-${fontFileSuffix}.woff2") format("woff2"),
      url("${TYPE_DIRECTORY}/${fontName}-${fontFileSuffix}.woff") format("woff");
    font-style: ${fontStyle};
    font-weight: ${fontWeight};
    font-display: swap;
  }
  `;
}
