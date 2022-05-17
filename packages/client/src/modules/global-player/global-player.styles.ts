import styled from "@emotion/styled";
import { animated } from "react-spring";

import { Paragraph, rhythm } from "../../fasteners/styles";
import { lineClamp } from "../../fasteners/styles/parts/styles.helpers";

/** Exterior wrapping component to handle overflow:hidden duties */
export const Wrap = styled.div`
  overflow: hidden;

  width: 100%;
  max-width: 480px;

  position: fixed;
  z-index: 99;
  bottom: 0;
  right: 0;
`;

export const Interior = styled(animated.div)`
  padding: ${rhythm(3 / 2)};
`;

export const Frame = styled.div`
  background-color: var(--colors-neutral-10);
  border-radius: calc(2 * var(--radii-media));

  display: grid;
  grid-template-columns: max-content 1fr;
  gap: ${rhythm(1 / 2)};

  padding: ${rhythm(1)};

  box-shadow: var(--shadows-20);
`;

export const Media = styled.img`
  width: 80px;
  height: 100%;
  object-fit: cover;

  border-radius: var(--radii-media);
  border: 1px solid var(--colors-neutral-90);
`;

export const Name = styled(Paragraph)`
  ${lineClamp(1)};
`;

export const Artist = styled(Paragraph)`
  ${lineClamp(1)};
`;

export const ActionFrame = styled.div`
  margin-top: ${rhythm(1 / 4)};

  display: flex;
  align-items: center;
  gap: ${rhythm(1 / 4)};
`;

export const TogglePlayButton = styled.button`
  --dimension: 24px;

  cursor: pointer;

  display: flex;
  aign-items: center;
  width: var(--dimension);
  height: var(--dimension);

  svg {
    width: 100%;
  }
`;
