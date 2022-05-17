import styled from "@emotion/styled";

import { headingTwo, rhythm } from "../../../fasteners/styles";

export const Wrap = styled.div`
  z-index: 0;
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  min-width: 100vw;

  display: flex;
  align-items: start;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    backdrop-filter: blur(25px);
  }
`;

export const Frame = styled.div`
  padding: ${rhythm(5)} ${rhythm(3)};
  max-width: 560px;
  width: 100%;
  box-sizing: content-box;
`;

export const SearchInput = styled.input`
  ${headingTwo};

  display: block;

  &::placeholder {
    font-style: italic;
  }
`;

export const ResultsFrame = styled.div`
  display: grid;
  margin-top: ${rhythm(1)};
`;

export const Result = styled.div<{ color: string | undefined }>`
  --border-color: ${({ color }) => color || "var(--colors-neutral-110)"};

  display: grid;
  grid-template-columns: max-content 1fr;
  gap: ${rhythm(1 / 2)};

  user-select: none;
  position: relative;
  z-index: 0;
  cursor: pointer;
  padding: ${rhythm(1)};

  img {
    width: 48px;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
    transition: opacity 80ms;
    z-index: -1;
    border-radius: var(--radii-media);
    border: 1px solid transparent;
  }

  &::before {
    background-color: var(--colors-neutral-90);
  }

  &::after {
    border: 2px solid var(--border-color);
  }

  &:hover,
  &:focus {
    &::before,
    &::after {
      opacity: 1;
    }
  }
`;
