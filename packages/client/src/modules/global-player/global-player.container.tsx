/**
 * Renders the global player that tracks across pages.
 * Also manages the play history.
 *
 * @author <@max-barry>
 * @since June 2020
 */

import { useSnapshot } from "valtio";

import {
  retrieveArtistByTrackId,
  retrieveTrackByTrackId
} from "../../datastores/datastore.firestore";
import {
  GlobalPlayerDatastore,
  onSetDuration,
  onSetRemaining,
  onTogglePlay
} from "../../datastores/datastore.global-player";
import { GlobalPlayerComponent } from "./global-player.component";

interface Props {}

export const GlobalPlayer: React.FC<Props> = () => {
  /** Retrieve the current player state */
  const { nowPlaying, playState, remainings, durations } = useSnapshot(
    GlobalPlayerDatastore
  );

  /** Retrieve the current track */
  const track = (nowPlaying && retrieveTrackByTrackId(nowPlaying)) || null;

  /** Retrieve the artist of this track */
  const artist = (nowPlaying && retrieveArtistByTrackId(nowPlaying)) || null;

  /** Retrieve the remaining and duration of this track */
  const duration = durations[nowPlaying || ""];
  const remaining = remainings[nowPlaying || ""];

  return (
    <GlobalPlayerComponent
      id={track && track.id}
      name={track && track.name}
      artist={artist && artist.name}
      artworkUrl100={artist && artist.artworkUrl100}
      enclosure={track && track.enclosure}
      duration={duration}
      remaining={remaining}
      onSetDuration={onSetDuration}
      onSetRemaining={onSetRemaining}
      nowPlaying={nowPlaying}
      playState={playState}
      onTogglePlay={onTogglePlay}
    />
  );
};
