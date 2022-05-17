import { PropsOf } from "@emotion/react";
import { useCallback } from "@storybook/addons";
import { Meta, Story } from "@storybook/react";
import { useState } from "react";
import { unsplash } from "../../fasteners/dx-tooling/random-unsplash.hook";
import { StoryToggleButton } from "../../fasteners/utility-fns/utility-fns.storybook";

import { GlobalPlayerComponent } from "./global-player.component";

type Props = PropsOf<typeof GlobalPlayerComponent>;

export default {
  title: "Modules/Global Player",
  component: GlobalPlayerComponent
} as Meta;

const Template: Story<Props> = args => {
  /** Start with no track id and show on toggle */
  const [nowPlaying, setNowPlaying] = useState<string | null>(args.nowPlaying);

  /** Is it currently playing? */
  const [playState, setPlayState] = useState(args.playState);

  /** Shortcut to invert play state */
  const onTogglePlay: Props["onTogglePlay"] = useCallback(
    () =>
      setPlayState(current => (current === "playing" ? "paused" : "playing")),
    []
  );

  return (
    <>
      <StoryToggleButton
        onClick={() => setNowPlaying(current => (!!current ? null : "x"))}
      >
        {nowPlaying ? "Close player" : "Start player"}
      </StoryToggleButton>
      <GlobalPlayerComponent
        {...args}
        nowPlaying={nowPlaying}
        playState={playState}
        onTogglePlay={onTogglePlay}
      />
    </>
  );
};

const args: Omit<Props, "onTogglePlay"> = {
  id: "x",
  enclosure: { url: "", type: "", length: "1" },
  duration: 100,
  remaining: 35,
  name: "Name of the track",
  artist: "Name of the artist",
  playState: "playing",
  artworkUrl100: unsplash(100, 100),
  nowPlaying: null,
  onSetDuration: () => {
    console.log("onSetDuration");
    return 1;
  },
  onSetRemaining: () => {
    console.log("onSetRemaining");
    return 0;
  }
};

export const Standard = Template.bind({});
Standard.args = args;
