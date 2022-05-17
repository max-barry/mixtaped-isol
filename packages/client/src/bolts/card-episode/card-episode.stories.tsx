import { useCallback, useState } from "react";

import { PropsOf } from "@emotion/react";
import styled from "@emotion/styled";
import { Meta, Story } from "@storybook/react";
import { up } from "styled-breakpoints";

import { unsplash } from "../../fasteners/dx-tooling/random-unsplash.hook";
import { CardEpisode } from "./card-episode.component";

type Props = PropsOf<typeof CardEpisode>;

export default {
  title: "Bolts/Card Episode",
  component: CardEpisode
} as Meta;

const Container = styled.div`
  ${up("medium")} {
    max-width: 480px;
  }
`;

const Template: Story<Omit<Props, "onTogglePlayState">> = args => {
  /** Manage the play state */
  const [playState, setPlayState] = useState<Props["playState"]>(
    args.playState
  );

  const onTogglePlayState = useCallback(
    () =>
      setPlayState(currentState => {
        let nextState: Props["playState"] = "readonly";

        switch (currentState) {
          case "readonly":
          case "paused":
            nextState = "playing";
            break;
          case "playing":
            nextState = "paused";
            break;
        }

        return nextState;
      }),
    []
  );

  return (
    <Container>
      <CardEpisode
        {...args}
        onTogglePlayState={onTogglePlayState}
        playState={playState}
      />
    </Container>
  );
};

const args: Omit<Props, "onTogglePlayState"> = {
  artist: "Name of the artist",
  name: "Name of the track",
  playState: "readonly",
  link: "http://example.com/path/to/page",
  pubDate: "Fri, 22 Apr 2022 19:34:18 -0400",
  duration: 100,
  remaining: 35,
  artworkUrl100: unsplash(100, 100)
};

export const Standard: Story = () => <Template {...args} />;

export const Draggable: Story = () => (
  <Template {...args} playState="draggable" />
);
Draggable.storyName = "w. draggable";

export const Expanding: Story = () => (
  <Template {...args} playState="expanding" />
);
Expanding.storyName = "w. expanding";
