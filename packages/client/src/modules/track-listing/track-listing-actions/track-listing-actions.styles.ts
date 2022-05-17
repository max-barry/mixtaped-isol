import { css } from "@emotion/react";
import styled from "@emotion/styled/macro";

import { paragraph, rhythm } from "../../../fasteners/styles";

const MIN_WIDTH_ACTIONS = 180;

export const Frame = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const sharedActionStyles = css`
  transform: none;
  transition: transform 230ms var(--ease-out-quint);

  &:hover,
  &:focus,
  &:focus-within {
    transform: scale(1.075);
  }
`;

export const SecondaryActions = styled.div`
  position: absolute;
  max-width: ${MIN_WIDTH_ACTIONS}px;
  margin-top: ${rhythm(1)};

  display: grid;
  gap: ${rhythm(1)};

  transition: opacity 180ms;

  [data-engaged="false"] & {
    pointer-events: none;
    opacity: 0;
  }
`;

export const SecondaryAction = styled.button`
  --size: 34px;
  --pad: ${rhythm(1 / 2)};

  ${paragraph};
  ${sharedActionStyles};

  display: flex;
  align-items: center;

  font-weight: 600;

  position: relative;
  min-height: var(--size);
  padding-left: var(--pad);
  padding-right: var(--pad);
  z-index: 0;
  cursor: pointer;

  &::before {
    content: "";
    border-radius: 25px;
    border-top-right-radius: var(--radii-media);
    border-bottom-right-radius: var(--radii-media);
    background-color: var(--colors-neutral-90);
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }

  svg {
    background-color: var(--colors-neutral-05);
    border: 2px solid var(--colors-neutral-90);
    border-radius: 50%;

    padding: calc(0.5 * var(--pad));
    height: var(--size);
    width: var(--size);
    position: relative;
    left: calc(-1 * var(--pad));
  }
`;

export const EngagedInput = styled.input`
  visibility: hidden;
  height: 0;
  width: 0;
  display: inline;
`;

export const EngagedToggle = styled.label`
  ${paragraph};
  ${sharedActionStyles};

  font-weight: 600;
  user-select: none;
  cursor: pointer;

  z-index: 0;
  width: 100%;
  position: relative;
  padding: ${rhythm(1 / 4)} ${rhythm(1 / 2)};

  display: inline-grid;
  align-items: center;
  grid-template-columns: 20px 1fr;
  gap: ${rhythm(1 / 4)};

  &::after,
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: var(--radii-media);
  }

  &::before {
    z-index: -2;
    background-color: var(--colors-neutral-10);
  }

  &::after {
    z-index: -1;
    background-color: var(--colors-primary-90);
    opacity: 0;
    transition: opacity 110ms;
  }

  [data-engaged="true"] &::after {
    opacity: 1;
  }
`;

export const EngagedIcons = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;

  svg {
    width: 100%;
    position: absolute;
    transition: transform 230ms var(--ease-out-quint);
  }

  [data-engaged="false"] & svg {
    &:first-of-type {
      transform: none;
    }

    &:last-of-type {
      transform: translate3d(0, -100%, 0);
    }
  }

  [data-engaged="true"] & svg {
    &:first-of-type {
      transform: translate3d(0, 100%, 0);
    }

    &:last-of-type {
      transform: none;
    }
  }
`;

export const Actions = styled.div`
  max-width: ${MIN_WIDTH_ACTIONS}px;
  width: 100%;

  *:not([data-mode="readonly"]) > & {
    label,
    button {
      opacity: 0.4;
      pointer-events: none;
    }
  }

  [data-mode="draggable"] > & [data-secondary-action-for="draggable"],
  [data-mode="expanding"] > & [data-secondary-action-for="expanding"] {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const Content = styled.div`
  will-change: transform;
  transform: translate3d(0, 0, 0);
  transition: transform 320ms var(--ease-out-expo);

  margin-top: ${rhythm(1)};

  [data-engaged="true"] & {
    transform: translate3d(calc(${MIN_WIDTH_ACTIONS}px + ${rhythm(1)}), 0, 0);
  }
`;
