import styled from "@emotion/styled";

import { remToPx, rhythm } from "../../fasteners/styles";
import { TRACK_LISTING_MODES } from "./track-listing.types";

const dataAttrs: { [K in TRACK_LISTING_MODES]: string } = {
  draggable: `[data-track-listing-mode="draggable"]`,
  expanding: `[data-track-listing-mode="expanding"]`,
  readonly: `[data-track-listing-mode="readonly"]`
};

/** What is the size of the grid-gap */
export const STYLE_GRID_GAP = remToPx(rhythm(1) as any);

export const Frame = styled.div`
  display: grid;
  position: relative;

  &:not(${dataAttrs.draggable}) {
    grid-gap: ${STYLE_GRID_GAP}px;
  }
`;
