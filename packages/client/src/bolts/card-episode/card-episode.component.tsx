import { useMemo } from "react";

import { PropsOf } from "@emotion/react";

import { Icon } from "../../fasteners/icon";
import {
  Frame,
  MediaFrame,
  EpisodeName,
  ArtistName,
  StateIcon,
  Content,
  Sources,
  Weblink,
  NeutralActions,
  LoadedActions
} from "./card-episode.styles";
import { CARD_SHOW_PLAY_STATES } from "./card-episode.types";
import { ProgressBar } from "../progress-bar";
import {
  prettyUrl,
  prettyDate
} from "../../fasteners/utility-fns/utility-fns.human-readable";
import { useDominantColor } from "../../fasteners/use-dominant-color";

type IconProps = PropsOf<typeof Icon>;

interface Props {
  /** Name of the track */
  name: Mixtaped.Track["name"];
  /** Name of the artist */
  artist: Mixtaped.Track["name"];
  /** URL to the artwork */
  artworkUrl100: Mixtaped.Track["artworkUrl100"];
  /** URL link on the track */
  link?: Mixtaped.Track["link"];
  /** Date of the track */
  pubDate: Mixtaped.Track["pubDate"];
  /** Is the current episode playing? "none" is the neutral state. */
  playState: CARD_SHOW_PLAY_STATES;
  /** What's the duration of this track */
  duration: Mixtaped.GlobalPlayerDatastore["durations"][string];
  /** How much is remaining for this track */
  remaining: Mixtaped.GlobalPlayerDatastore["remainings"][string];
  /** The user wants to play / pause */
  onTogglePlayState(): void;
}

/** Where a show can link to */
const EPISODE_SOURCES = [
  "podcast_app_itunes",
  "podcast_app_pocketcasts",
  "podcast_app_overcast"
] as const;

export const CardEpisode: React.FC<Props> = ({
  name,
  artist,
  playState,
  link,
  pubDate,
  duration,
  remaining,
  artworkUrl100: artwork,
  onTogglePlayState
}) => {
  /** Determine the dominant color of the artwork */
  const { dominant, accent } = useDominantColor(artwork);

  /** The icon for the media's current play state */
  const icon = useMemo(() => {
    let name: IconProps["name"] | undefined = undefined;
    let collection: IconProps["collection"] | undefined = undefined;

    switch (playState) {
      case "readonly":
      case "paused":
        name = "play_circle";
        collection = "av";
        break;
      case "playing":
        name = "pause_circle_filled";
        collection = "av";
        break;
      case "draggable":
        name = "drag_indicator";
        collection = "action";
        break;
    }

    return { name, collection };
  }, [playState]);

  return (
    <Frame data-play-state={playState} color={dominant}>
      <MediaFrame
        onClick={useMemo(
          () => (playState === "draggable" ? undefined : onTogglePlayState),
          [onTogglePlayState, playState]
        )}
      >
        <img
          alt={`Track artwork for "${name}"`}
          draggable={false}
          src={artwork}
          loading="lazy"
        />
      </MediaFrame>
      <Content>
        <EpisodeName weight="bold">{name}</EpisodeName>
        <ArtistName weight="medium" color="secondary">
          {artist} • {prettyDate(pubDate)}
        </ArtistName>
        <LoadedActions aria-hidden={playState !== "readonly"}>
          <ProgressBar
            duration={duration}
            remaining={remaining}
            color={accent || dominant}
          />
        </LoadedActions>
        <NeutralActions aria-hidden={playState === "readonly"}>
          <Sources>
            {EPISODE_SOURCES.map(name => (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a href="#" key={name}>
                <Icon preserveColor={true} collection="custom" name={name} />
              </a>
            ))}
            {link && (
              <Weblink weight="medium" color="secondary">
                <Icon role="presentation" collection="content" name="link" />
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#">{prettyUrl(link)}</a>
              </Weblink>
            )}
          </Sources>
        </NeutralActions>
      </Content>
      {icon.collection && icon.name && (
        <StateIcon collection={icon.collection} name={icon.name} />
      )}
    </Frame>
  );
};
