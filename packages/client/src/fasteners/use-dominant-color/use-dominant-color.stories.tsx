import { useCallback, useState } from "react";

import styled from "@emotion/styled";
import { Meta, Story } from "@storybook/react";

import { Paragraph } from "../styles";
import { StoryToggleButton } from "../utility-fns/utility-fns.storybook";
import { useDominantColor } from "./use-dominant-color.hook";

export default {
  title: "Fasteners/useDominantColor"
} as Meta;

const SAMPLE_IMAGE_W = 400;

/** List of example unsplash URLs */
const SAMPLE_IMAGERY = [
  `https://images.unsplash.com/photo-1652387411197-2b0e2a92a764?w=${SAMPLE_IMAGE_W}`,
  `https://images.unsplash.com/photo-1652297883219-71dace8485c0?w=${SAMPLE_IMAGE_W}`,
  `https://images.unsplash.com/photo-1652377599371-a6e4ff21c8cf?w=${SAMPLE_IMAGE_W}`,
  `https://images.unsplash.com/photo-1652367653100-1f7b51675226?w=${SAMPLE_IMAGE_W}`,
  `https://images.unsplash.com/photo-1652429631098-e8c9d924b3fc?w=${SAMPLE_IMAGE_W}`,
  `https://images.unsplash.com/photo-1652381736447-d2cd74dcdc14?w=${SAMPLE_IMAGE_W}`,
  `https://images.unsplash.com/photo-1652410818187-817f37f4293d?w=${SAMPLE_IMAGE_W}`
];

export const Standard: Story = () => {
  /** Counter to index through the samples */
  const [index, setIndex] = useState(0);

  /** What src are we handling */
  const src = SAMPLE_IMAGERY[index];

  /** Take an unsplash url and work out the dominant color */
  const palette = useDominantColor(src);

  /** Container components */
  const Frame = styled.div`
    display: grid;
    gap: 32px;
    grid-template-columns: ${SAMPLE_IMAGE_W}px 1fr;
  `;

  const ColorBlock = styled.div`
    margin-top: 32px;
    width: 100px;
    height: 100px;
  `;

  const ColorBlockDominant = styled(ColorBlock)`
    background-color: ${palette.dominant};
  `;

  const ColorBlockAccent = styled(ColorBlock)`
    background-color: ${palette.accent};
  `;

  const ColorBlockTertiary = styled(ColorBlock)`
    background-color: ${palette.tertiary};
  `;

  /** Quick utility to cycle the imagery */
  const onCycleImagery = useCallback(
    () =>
      setIndex(current =>
        current + 1 > SAMPLE_IMAGERY.length - 1 ? 0 : current + 1
      ),
    []
  );

  return (
    <Frame>
      <div>
        <StoryToggleButton onClick={onCycleImagery}>
          Change image
        </StoryToggleButton>
        <img src={src} alt="" />
      </div>
      {!palette.resolved && (
        <Paragraph weight="bold">Working out the pallette...</Paragraph>
      )}
      {palette.resolved && (
        <div>
          <Paragraph weight="bold">Done</Paragraph>
          <ColorBlockAccent />
          <ColorBlockDominant />
          <ColorBlockTertiary />
        </div>
      )}
    </Frame>
  );
};
