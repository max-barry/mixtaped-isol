import { useState } from "react";

import { up } from "styled-breakpoints";
import { PropsOf } from "@emotion/react";
import styled from "@emotion/styled";
import { Meta, Story } from "@storybook/react";

import { TrackListing } from "./track-listing.component";
import { StoryToggleButton } from "../../fasteners/utility-fns/utility-fns.storybook";
import { unsplash } from "../../fasteners/dx-tooling/random-unsplash.hook";

type Props = PropsOf<typeof TrackListing>;

/** @hack because of limits in storybook rendering props */
type _Props = Omit<Props, "mode"> & { _mode: Props["mode"] };

export default {
  title: "Modules/Track Listing",
  component: TrackListing
} as Meta;

const Container = styled.div`
  ${up("medium")} {
    max-width: 480px;
  }
`;

const Template: Story<_Props> = args => (
  <Container>
    <TrackListing {...args} mode={args._mode} />
  </Container>
);

const trackArgs: Omit<_Props["tracks"][number], "id"> = {
  name: "Name of the track",
  artist: "Name of the artist",
  link: "https://example.com/path/to/page",
  pubDate: "Fri, 22 Apr 2022 19:34:18 -0400",
  artworkUrl100: unsplash(100, 100)
};

const args: _Props = {
  _mode: "readonly",
  hasPlayed: [],
  nowPlaying: null,
  globalPlayState: "paused",
  remainings: {},
  durations: {},
  onTogglePlay: console.log,
  onChangeMode: console.log,
  onDragEnd: console.log,
  onAddTrack: console.log,
  tracks: new Array(5)
    .fill(undefined)
    .map((_, i) => ({ ...trackArgs, id: `track-arg-${i}` }))
};

export const Standard: Story<_Props> = args => {
  /** The mode of the track listing */
  const [trackListingMode, setTrackListingMode] =
    useState<_Props["_mode"]>("readonly");

  /** on set to drag mode */
  const onClickDragging = () =>
    setTrackListingMode(current =>
      current === "draggable" ? "readonly" : "draggable"
    );

  /** on set to expand mode */
  const onClickExpanding = () =>
    setTrackListingMode(current =>
      current === "expanding" ? "readonly" : "expanding"
    );

  const Actions = styled.div`
    display: flex;
    gap: 16px;
  `;

  return (
    <>
      <Actions>
        <StoryToggleButton onClick={onClickDragging}>
          {trackListingMode === "draggable"
            ? "Turn off dragging mode"
            : "Turn on dragging mode"}
        </StoryToggleButton>
        <StoryToggleButton onClick={onClickExpanding}>
          {trackListingMode === "expanding"
            ? "Turn off expanding mode"
            : "Turn on expanding mode"}
        </StoryToggleButton>
      </Actions>
      <Template {...args} _mode={trackListingMode} />
    </>
  );
};
Standard.args = args;

export const ReadOnly = Template.bind({});
ReadOnly.args = { ...args, _mode: "readonly" };
ReadOnly.storyName = "w. readonly";

export const Draggable = Template.bind({});
Draggable.args = { ...args, _mode: "draggable" };
Draggable.storyName = "w. draggable";

export const Expanding = Template.bind({});
Expanding.args = { ...args, _mode: "expanding" };
Expanding.storyName = "w. expanding";
