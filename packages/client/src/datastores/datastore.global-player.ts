/**
 * Data proxy representing the global player's state.
 *
 * @author Max Barry <@max-barry>
 */
import { proxy, snapshot } from "valtio";

const initialGlobalPlayerDatastore: Mixtaped.GlobalPlayerDatastore = {
  nowPlaying: null,
  hasPlayed: [],
  playState: "paused",
  durations: {},
  remainings: {}
};

export const GlobalPlayerDatastore = proxy(initialGlobalPlayerDatastore);

/** Action to play a track */
export const onTogglePlay = (trackId: Mixtaped.Track["id"] | null) => {
  /** Pull apart our datastore */
  const current = snapshot(GlobalPlayerDatastore);

  /** Add this track to the hasPlayed list (keeping unique) */
  trackId &&
    (GlobalPlayerDatastore.hasPlayed = Array.from(
      new Set([...current.hasPlayed, trackId])
    ));

  /** If the track is changing */
  if (current.nowPlaying !== trackId) {
    /** Play if a track. Pause if not */
    GlobalPlayerDatastore.playState = trackId ? "playing" : "paused";
    /** Set the now playing */
    GlobalPlayerDatastore.nowPlaying = trackId;
  } else
  /** Otherwise the now playing isn't changing. So we just invert the play state. */
    GlobalPlayerDatastore.playState =
      current.playState === "playing" ? "paused" : "playing";
};

/** Action to set the duration of a track */
export const onSetDuration = (
  trackId: Mixtaped.Track["id"],
  duration: number
) => (GlobalPlayerDatastore.durations[trackId] = duration);

/** Action to set the remaining of a track */
export const onSetRemaining = (
  trackId: Mixtaped.Track["id"],
  remaining: number
) => (GlobalPlayerDatastore.remainings[trackId] = remaining);
