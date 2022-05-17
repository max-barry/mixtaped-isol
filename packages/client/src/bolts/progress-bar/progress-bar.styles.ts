import styled from "@emotion/styled";
import { lighten } from "polished";

import { Caption, rhythm } from "../../fasteners/styles";

export const Frame = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: ${rhythm(1 / 4)};
`;

export const Progress = styled.progress<{ color: string | undefined }>`
  --color-foreground: ${({ color }) => color || "var(--colors-neutral-110)"};
  --color-background: ${({ color }) =>
    color ? lighten(0.35, color) : "var(--colors-neutral-90)"};

  width: 100%;
  display: block;
  overflow: hidden;
  cursor: pointer;

  &[value] {
    background-color: transparent;
    color: transparent;
    height: 8px;
    appearance: none;
    -webkit-appearance: none;
    border-radius: var(--radii-media);
  }

  &::-webkit-progress-value {
    background-color: var(--color-foreground);
  }

  &[value]::-webkit-progress-bar {
    background-color: var(--color-background);
    border-radius: var(--radii-media);
  }
`;

export const Duration = styled(Caption)`
  line-height: 1;
  min-width: 40px;
  text-align: right;
  font-variant-numeric: tabular-nums;
`;
