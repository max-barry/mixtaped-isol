import { createPortal } from "react-dom";

import { PropsOf } from "@emotion/react";
import { config, useSpring } from "react-spring";

import {
  Wrap,
  Frame,
  Media,
  Name,
  Artist,
  ActionFrame,
  TogglePlayButton,
  Interior
} from "./global-player.styles";
import { ProgressBar } from "../../bolts/progress-bar";
import { Icon } from "../../fasteners/icon";
import { useDominantColor } from "../../fasteners/use-dominant-color";
import {
  onSetDuration,
  onSetRemaining,
  onTogglePlay
} from "../../datastores/datastore.global-player";
import { AudioTag } from "./audio-tag.container";

interface Props {
  /** The ID of the current track */
  id: Mixtaped.Track["id"] | null;
  /** Name of the currently playing show */
  name: Mixtaped.Track["name"] | null;
  /** Name of the artist playing show */
  artist: Mixtaped.Track["artist"] | null;
  /** Artwork of the track */
  artworkUrl100: Mixtaped.Track["artworkUrl100"] | null;
  /** Get the enclosure of the track itself */
  enclosure: Mixtaped.Track["enclosure"] | null;
  /** What is currently playing */
  nowPlaying: Mixtaped.GlobalPlayerDatastore["nowPlaying"];
  /** Current play state of the player */
  playState: Mixtaped.GlobalPlayerDatastore["playState"];
  /** The length of this track (integer) */
  duration: Mixtaped.GlobalPlayerDatastore["durations"][string];
  /** How much is remaining in this track (integer) */
  remaining: Mixtaped.GlobalPlayerDatastore["remainings"][string];
  /** When we want to update the duration remaining */
  onSetDuration: typeof onSetDuration;
  /** When we want to update the duration remaining */
  onSetRemaining: typeof onSetRemaining;
  /** Function to run when we pause / play */
  onTogglePlay: typeof onTogglePlay;
}

export const GlobalPlayerComponent: React.FC<Props> = ({
  id: trackId,
  name,
  artist,
  nowPlaying,
  playState,
  enclosure,
  duration,
  remaining,
  artworkUrl100: artwork,
  onSetDuration,
  onSetRemaining,
  onTogglePlay
}) => {
  /** Discover the dominant colors of the artwork */
  const { dominant, accent } = useDominantColor(artwork);

  /** Spring to control the player's visibilty */
  const spring = useSpring({ y: nowPlaying ? 0 : 100, config: config.stiff });

  /** The aria-label for the play/pause button */
  const ariaPlayPause = `${
    playState === "playing" ? "Pause" : "Play"
  } "${name}"`;

  /** Current play/pause icon */
  const playPauseIcon: PropsOf<typeof Icon>["name"] =
    playState === "playing" ? "pause_circle_filled" : "play_circle_filled";

  return createPortal(
    <>
      <Wrap>
        <Interior
          style={{
            transform: spring.y.to(dy => `translate3d(0, ${dy}%, 0)`)
          }}
        >
          <Frame>
            <Media src={artwork || ""} loading="lazy" draggable={false} />
            <div>
              <Name weight="bold">{name}</Name>
              <Artist weight="medium">{artist}</Artist>
              <ActionFrame>
                <TogglePlayButton
                  onClick={() => nowPlaying && onTogglePlay(nowPlaying)}
                  aria-label={ariaPlayPause}
                >
                  <Icon
                    role="presentation"
                    collection="av"
                    name={playPauseIcon}
                  />
                </TogglePlayButton>
                <ProgressBar
                  duration={duration}
                  remaining={remaining}
                  color={accent || dominant}
                />
              </ActionFrame>
            </div>
          </Frame>
        </Interior>
      </Wrap>
      {enclosure && trackId && (
        <AudioTag
          trackId={trackId}
          onSetDuration={onSetDuration}
          onSetRemaining={onSetRemaining}
          remaining={remaining}
          duration={duration}
          enclosure={enclosure}
          playState={playState}
        />
      )}
    </>,
    document.getElementById("root")!
  );
};
