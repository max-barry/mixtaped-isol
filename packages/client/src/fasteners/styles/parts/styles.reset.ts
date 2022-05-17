import { css } from "@emotion/react";

export const cssResetStandard = css`
  /*** The new CSS Reset - version 1.2.0 (last updated 23.7.2021) ***/

  /* Remove all the styles of the "User-Agent-Stylesheet", except for the 'display' property */
  *:where(:not(iframe, canvas, img, svg, video):not(svg *)) {
    all: unset;
    display: revert;
  }

  /* Preferred box-sizing value */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /*
  Remove list styles (bullets/numbers)
  in case you use it with normalize.css
*/
  ol,
  ul {
    list-style: none;
  }

  /* For images to not be able to exceed their container */
  img {
    max-width: 100%;
  }

  /* Removes spacing between cells in tables */
  table {
    border-collapse: collapse;
  }

  /* Revert the 'white-space' property for textarea elements on Safari */
  textarea {
    white-space: revert;
  }
`;

export const cssResetCustom = css`
  img,
  video {
    margin: 0;
    display: block;
  }

  html {
    overscroll-behavior-y: none;
  }
`;
