import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled/macro";

import { Icon as _Icon } from "../../fasteners/icon";
import { Paragraph, rhythm } from "../../fasteners/styles";
import { lineClamp } from "../../fasteners/styles/parts/styles.helpers";
import { CARD_SHOW_PLAY_STATES } from "./card-episode.types";

const dataAttr: { [K in CARD_SHOW_PLAY_STATES]: `[data-play-state="${K}"]` } = {
  readonly: `[data-play-state="readonly"]`,
  paused: `[data-play-state="paused"]`,
  playing: `[data-play-state="playing"]`,
  draggable: `[data-play-state="draggable"]`,
  expanding: `[data-play-state="expanding"]`
};

const rotateClockwise = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const CARD_EPISODE_MEDIA_SIZE = 96;

export const MediaFrame = styled.button`
  position: relative;
  overflow: hidden;
  border-radius: var(--radii-media);

  ${dataAttr.readonly} &,
  ${dataAttr.paused} &,
  ${dataAttr.playing} & {
    cursor: pointer;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: hsl(0, 0%, 0%, 0.45);
    opacity: 0;
    z-index: 1;
    backdrop-filter: blur(2px);
    pointer-events: none;

    ${dataAttr.draggable} & {
      opacity: 1;
    }
  }

  > img {
    box-shadow: var(--shadows-20);
  }
`;

export const StateIcon = styled(_Icon)`
  width: ${rhythm(2)};
  color: var(--colors-white);
  opacity: 0;
  pointer-events: none;

  /**
   * When the play state changes we perform a small icon animation.
   * It's an optical illusion that stands in for an SVG morph.
   */
  ${dataAttr.playing} &,
  ${dataAttr.paused} & {
    animation: ${rotateClockwise} 540ms var(--ease-in-out-quad);
  }

  ${dataAttr.draggable} & {
    opacity: 1;
  }
`;

/**
 * The interaction animation when the card is in a neutral state.
 * @todo: this is an extremely messy implementation.
 */
const interactionState = css`
  ${MediaFrame}, ${MediaFrame} img, &::before {
    will-change: transform;
    transition: transform 220ms var(--ease-out-quint);
  }

  ${MediaFrame} img {
    transition-duration: 440ms;
  }

  ${MediaFrame}::before {
    transition: opacity 80ms;
  }

  &:hover,
  &:focus-within,
  &${dataAttr.playing} {
    ${MediaFrame} img {
      transform: scale(1.1);
    }

    ${MediaFrame}::before, ${StateIcon} {
      opacity: 1;
    }

    &::before {
      transform: scale(0.975);
    }
  }

  ${MediaFrame}:active {
    transform: scale(0.95);
  }
`;

export const Content = styled.div`
  position: relative;
`;

export const Frame = styled.div<{ color: string | undefined }>`
  --media-size: ${CARD_EPISODE_MEDIA_SIZE}px;

  --border-hint-color: ${({ color }) => color || "var(--colors-neutral-10)"};
  --border-hint-dimension: ${rhythm(1 / 5)};

  user-select: none;
  overflow: hidden;
  z-index: 0;
  position: relative;
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: ${rhythm(1)};
  padding: ${rhythm(1 / 2)};
  padding-right: ${rhythm(1)};

  > * {
    grid-row: 1;
  }

  ${MediaFrame} {
    grid-column: 1;
    width: var(--media-size);
    height: var(--media-size);
  }

  ${Content} {
    grid-column: 2;
  }

  ${StateIcon} {
    grid-column: 1;
    z-index: 1;
    align-self: center;
    justify-self: center;
  }

  &::before,
  &::after {
    content: "";
    content: "";
    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: calc(0.5 * var(--media-size));
    border-radius: var(--radii-media);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &::after {
    z-index: -2;
    top: var(--border-hint-dimension);
    background-color: var(--border-hint-color);
  }

  &::before {
    background-color: var(--colors-white);
    right: var(--border-hint-dimension);
    bottom: var(--border-hint-dimension);
    transform-origin: top left;
  }

  // Not interactive when draggable or expanding
  &${dataAttr.readonly}, &${dataAttr.paused}, &${dataAttr.playing} {
    ${interactionState};
  }
`;

export const EpisodeName = styled(Paragraph)`
  ${lineClamp(1)};
`;

export const ArtistName = styled(Paragraph)`
  ${lineClamp(1)};
`;

export const Sources = styled.div`
  display: flex;
  gap: ${rhythm(1 / 4)};

  > a {
    cursor: pointer;
    line-height: 1;

    svg {
      width: 24px;
    }
  }
`;

export const Weblink = styled(Paragraph)`
  display: flex;
  margin-left: ${rhythm(1 / 4)};
  gap: ${rhythm(1 / 4)};

  a {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const Actions = styled.div`
  margin-top: ${rhythm(1 / 2)};
  transition: transform 340ms var(--ease-out-quint), opacity 180ms;

  ${dataAttr.draggable} &,
  ${dataAttr.expanding} & {
    opacity: 0;
    pointer-events: none;
  }
`;

export const NeutralActions = styled(Actions)`
  ${dataAttr.playing} &,
  ${dataAttr.paused} & {
    opacity: 0;
    transform: translateY(100%);
    pointer-events: none;
  }
`;

export const LoadedActions = styled(Actions)`
  position: absolute;
  left: 0;
  right: 0;

  ${dataAttr.readonly} & {
    opacity: 0;
    transform: translateY(100%);
    pointer-events: none;
  }
`;
