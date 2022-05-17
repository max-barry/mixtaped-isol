import { useCallback, useEffect, useRef } from "react";

import {
  onSetDuration as OnSetDuration,
  onSetRemaining as OnSetRemaining
} from "../../datastores/datastore.global-player";
import { useIdleCallback } from "../../fasteners/utility-fns/utility-fns.web";

interface Props {
  /** ID of the playing track */
  trackId: Mixtaped.Track["id"];
  /** Get the enclosure of the track itself */
  enclosure: Mixtaped.Track["enclosure"];
  /** Global play state status */
  playState: Mixtaped.GlobalPlayerDatastore["playState"];
  /** Remaining in seconds */
  remaining: number | undefined;
  /** Duration in seconds */
  duration: number | undefined;
  /** Handler for updating duration */
  onSetDuration: typeof OnSetDuration;
  /** Handler for updating remaining */
  onSetRemaining: typeof OnSetRemaining;
}

export const AudioTag: React.FC<Props> = ({
  playState,
  trackId,
  enclosure,
  remaining,
  duration,
  onSetDuration,
  onSetRemaining
}) => {
  /** ref to attach to the element */
  const $audio = useRef<HTMLAudioElement>(null);

  /** Track the "last" src before this */
  const priorEnclosureUrl = useRef(enclosure.url);

  /** Track the "last" play state before this */
  const priorPlayState = useRef(playState);

  /** Ref to track when we've booted */
  const hasBootstrapped = useRef(false);

  /** Callback when the audio player ticks over */
  const onTimeUpdate = useIdleCallback(
    useCallback(() => {
      /** @temp: remove scrubbing functionality */
      const isScrubbing = false;

      /** Don't react to scrubbing events */
      if (!$audio.current || isScrubbing) return;

      /** Read props from the player */
      const { duration, currentTime } = $audio.current;

      /** Update the global store */
      onSetDuration(trackId, isNaN(duration) ? 1 : duration);
      onSetRemaining(trackId, isNaN(duration) ? 0 : duration - currentTime);
    }, [onSetDuration, onSetRemaining, trackId])
  );

  /** When the tag's src changes */
  useEffect(() => {
    if (!$audio.current) return;

    /** If the src has changed OR this is the first render */
    if (
      enclosure.url !== priorEnclosureUrl.current ||
      !hasBootstrapped.current
    ) {
      /** The first time this happens we want to set as bootstrapped */
      hasBootstrapped.current = true;

      /** Reload the audio tag */
      $audio.current.load();

      /** Scrub to the last position if played before */
      if (remaining && duration)
        $audio.current.currentTime = duration - remaining;

      /** Play */
      $audio.current.play();

      /** Mark this as the new normal */
      priorEnclosureUrl.current = enclosure.url;
    }
  }, [duration, enclosure.url, remaining]);

  /** When the play state changes, play/pause the tag */
  useEffect(() => {
    if (!$audio.current || !hasBootstrapped.current) return;

    /** Check if the play state has changed */
    if (priorPlayState.current !== playState) {
      /** Update our concept of "last" */
      priorPlayState.current = playState;

      /** Ready the audio tag if needed */
      $audio.current.readyState === 0 && $audio.current.load();

      /** Match the tag to match the global play state */
      $audio.current[playState === "playing" ? "play" : "pause"]();
    }
  }, [enclosure.url, playState]);

  return (
    <audio ref={$audio} onTimeUpdate={onTimeUpdate}>
      <source src={enclosure.url} type={enclosure.type || "audio/mp3"} />
    </audio>
  );
};
