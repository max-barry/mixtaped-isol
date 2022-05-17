/**
 * Tracg listing is the core list of episodes within a tape.
 * It has multiple "modes": readonly, draggable, addable.
 *
 * @author Max Barry <@max-barry>
 * @since March 2020
 *
 * @see {@link https://codesandbox.io/s/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/draggable-list}
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useDrag } from "@use-gesture/react";
import { animated, useSprings, useTrail } from "react-spring";
import { PropsOf } from "@emotion/react";

import { Frame, STYLE_GRID_GAP } from "./track-listing.styles";
import {
  clamp,
  swap
} from "../../fasteners/utility-fns/utility-fns.primitives";
import { useMeasure } from "../../fasteners/utility-fns/utility-fns.web";
import { CardEpisode } from "../../bolts/card-episode";
import { TRACK_LISTING_MODES } from "./track-listing.types";
import { TrackListingActions } from "./track-listing-actions";
import { onTogglePlay as OnTogglePlay } from "../../datastores/datastore.global-player";
import { MixtapeRecord } from "../../datastores/datastore.firestore";
import { AddTrack } from "./add-track";

type CardEpisodeProps = PropsOf<typeof CardEpisode>;

/** Shortcut our global namespace */
type Track = Pick<
  Mixtaped.Track,
  "id" | "artworkUrl100" | "name" | "artist" | "link" | "pubDate"
>;

interface Props {
  /** What "mode" is the track-listing in */
  mode: TRACK_LISTING_MODES;
  /** Currently playing track ID */
  nowPlaying: Mixtaped.GlobalPlayerDatastore["nowPlaying"];
  /** Array of al tracks that have at some point played (and we have pickup data for) */
  hasPlayed: Mixtaped.GlobalPlayerDatastore["hasPlayed"];
  /** All remaining track values */
  remainings: Mixtaped.GlobalPlayerDatastore["remainings"];
  /** All duration track values */
  durations: Mixtaped.GlobalPlayerDatastore["durations"];
  /** What state is the global player in? */
  globalPlayState: Mixtaped.GlobalPlayerDatastore["playState"];
  /** Change the mode of the list */
  onChangeMode(mode: TRACK_LISTING_MODES): void;
  /** Macro controls for the global player */
  onTogglePlay: typeof OnTogglePlay;
  /** When we're done dragging. Use to save the new order */
  onDragEnd: MixtapeRecord["onSortMixtape"];
  /** When we're done adding. Use to save the new track */
  onAddTrack: MixtapeRecord["onAddTrack"];
  /** Array of tracks to render */
  tracks: Track[];
}

export const TrackListing: React.FC<Props> = ({
  tracks,
  mode,
  hasPlayed,
  nowPlaying,
  globalPlayState,
  remainings,
  durations,
  onAddTrack,
  onChangeMode,
  onDragEnd,
  onTogglePlay
}) => {
  /** We need to do some set-up calculations with heights. This hides elements until true */
  const [hasBootstrapped, setBootstrapped] = useState({
    $firstElement: false
  });

  /** Ref to attach to the first child */
  const $firstElement = useRef<HTMLDivElement>(null);

  /** ResizeObserver to measure the height of the first element in our list */
  const { height: firstElementHeight } = useMeasure($firstElement);

  /** Calculate the element height with an assumed height */
  const elementHeight = firstElementHeight + STYLE_GRID_GAP;

  /** Track changes in the listing mode */
  const priorTrackListingMode = useRef(mode);
  const hasTrackingModeChanged = priorTrackListingMode.current !== mode;

  /**
   * --------------------------------------------------------
   * Handlers related to the "dragable" mode of the tracklisting
   * --------------------------------------------------------
   */

  /** Ref for storing the temporary order of items during drag state */
  const draggedOrder = useRef(naturalOrder(tracks.length));

  /** Springs to control our Y animation animation */
  const [dragSprings, dragSpringsApi] = useSprings(
    tracks.length,
    calculateDragStyles({
      order: draggedOrder.current,
      isBeingDragged: false,
      elementHeight
    })
  );

  /** Trail animation for opacity */
  const opacities = useTrail(tracks.length, {
    opacity: hasBootstrapped.$firstElement ? 1 : 0
  });

  /** Create a binding ref for our dragging action */
  const bindDrag = useDrag(
    ({ args: [initialIndex], active: isBeingDragged, movement: [, dy] }) => {
      /** What is the index of the dragged item */
      const currentIndex = draggedOrder.current.indexOf(initialIndex);

      /** What is the the y value of the dragged item's row */
      const currentRow = clamp(
        Math.round((currentIndex * elementHeight + dy) / elementHeight),
        0,
        tracks.length - 1
      );

      /** Track our new order  */
      const nextOrder = swap(draggedOrder.current, currentIndex, currentRow);

      /** Recalculate the new target styles given this order shuffle */
      dragSpringsApi.start(
        calculateDragStyles({
          order: nextOrder,
          isBeingDragged,
          elementHeight,
          initialIndex,
          currentIndex,
          dy
        })
      );

      if (!isBeingDragged)
        /** Set the order locally */
        draggedOrder.current = nextOrder;
    }
  );

  /**
   * Resets our dragging styles.
   *
   * This may happen for a number of reasons,
   * e.g. adding a track or entering/existing draging-mode.
   */
  const resetDraggingStyles = useCallback(
    (shouldResetOrder: boolean) => {
      /** If we should reset the order to natural flow */
      if (shouldResetOrder) draggedOrder.current = naturalOrder(tracks.length);

      /** Reset the spring */
      dragSpringsApi.start(
        calculateDragStyles({
          order: draggedOrder.current,
          isBeingDragged: false,
          elementHeight
        })
      );
    },
    [dragSpringsApi, elementHeight, tracks.length]
  );

  /** As soon as we have heights calculated for the elements, we want to reveal them */
  useEffect(() => {
    if (hasBootstrapped.$firstElement || firstElementHeight === 0) return;

    /** Re-calculate the styles */
    resetDraggingStyles(false);

    /** Mark as bootstrapped */
    setBootstrapped(current => ({ ...current, $firstElement: true }));
  }, [firstElementHeight, hasBootstrapped.$firstElement, resetDraggingStyles]);

  /**
   * When we leave the dragging mode, we want to
   * call up the stack about the change in order.
   */
  useEffect(() => {
    /** If this is us "leaving" the drag mode, then call up the stack with the new order */
    if (
      hasTrackingModeChanged &&
      priorTrackListingMode.current === "draggable"
    ) {
      /** Call up the stack with the new order */
      onDragEnd(draggedOrder.current.map(i => tracks[i].id));

      /** Restate our dragging styles for this change */
      resetDraggingStyles(true);
    }
  }, [hasTrackingModeChanged, onDragEnd, resetDraggingStyles, tracks]);

  /** When new tracks are added we want to reset our dragging styles */
  useEffect(() => {
    tracks.length !== draggedOrder.current.length && resetDraggingStyles(true);
  }, [resetDraggingStyles, tracks.length]);

  /** Track the changes in the tracking mode */
  useEffect(() => {
    priorTrackListingMode.current !== mode &&
      (priorTrackListingMode.current = mode);
  }, [mode]);

  return (
    <TrackListingActions mode={mode} onChangeMode={onChangeMode}>
      <Frame role="list" data-track-listing-mode={`${mode}`}>
        {createPortal(
          mode === "expanding" ? (
            <AddTrack
              onExit={() => onChangeMode("readonly")}
              onSelect={onAddTrack}
            />
          ) : null,
          document.getElementById("root")!
        )}
        {dragSprings.map((_dragStyles, i) => {
          const track = tracks[i];

          /** index to get our drag binding */
          const dragBinding = mode === "draggable" ? bindDrag(i) : {};

          /** base styles for all elements */
          const baseStyles = { width: "100%", touchAction: "none" };

          /** index to get our opacity */
          const { opacity } = opacities[i];

          const dragStyles =
            mode === "draggable"
              ? { ..._dragStyles, position: "absolute" as const }
              : undefined;

          /** Pool all our styles together */
          const styles = {
            ...baseStyles,
            ...dragStyles,
            opacity
          };

          /** Determine the playlist of this */
          const playState = determineTrackPlayState(
            mode,
            { hasPlayed, nowPlaying, globalPlayState },
            track.id
          );

          /** What's remaining on this track if any? */
          const remaining = remainings[track.id];

          /** What's the duration of this track if any? */
          const duration = durations[track.id];

          /** When the customer clicks to play / pause */
          const onTogglePlayState: CardEpisodeProps["onTogglePlayState"] = () =>
            onTogglePlay(track.id);

          /** Attach a ref to the first item to measure the height */
          const $ref = i === 0 ? $firstElement : undefined;

          return (
            <animated.div
              key={track.id}
              role="listitem"
              {...dragBinding}
              style={styles}
            >
              <div ref={$ref}>
                <CardEpisode
                  {...track}
                  playState={playState}
                  duration={duration}
                  remaining={remaining}
                  onTogglePlayState={onTogglePlayState}
                />
              </div>
            </animated.div>
          );
        })}
      </Frame>
    </TrackListingActions>
  );
};

/**
 * Given the current state of the track-list, what format should each cards be in?
 */
function determineTrackPlayState(
  mode: Props["mode"],
  {
    hasPlayed,
    nowPlaying,
    globalPlayState
  }: Pick<Props, "hasPlayed" | "nowPlaying" | "globalPlayState">,
  trackId: Track["id"]
) {
  let playState: CardEpisodeProps["playState"];

  /** What global track listing modes override limited tracking modes */
  const TRACKING_MODE_OVERRIDES: TRACK_LISTING_MODES[] = [
    "draggable",
    "expanding"
  ];

  if (TRACKING_MODE_OVERRIDES.includes(mode)) {
    /**
     * If the mode of the list is "draggable" or "expanding",
     * then all tracks reflect this.
     */
    playState = mode;
  } else if (nowPlaying === trackId) {
    /** If the track is currently selected for global play, then it's in whatever state the global player is in */
    playState = globalPlayState;
  } else if (hasPlayed.includes(trackId)) {
    /** If it's ever played it's paused */
    playState = "paused";
  } else {
    /** If it's never played, it's "readonly" */
    playState = "readonly";
  }

  return playState;
}

/**
 * Calculates the style of our children depending on if they're dragging or not.
 */
function calculateDragStyles(args: {
  order: number[];
  isBeingDragged: boolean;
  elementHeight: number;
  initialIndex?: number;
  currentIndex?: number;
  dy?: number;
}) {
  /** Destructure args and set defaults */
  const {
    elementHeight,
    order,
    isBeingDragged,
    initialIndex = 0,
    currentIndex = 0,
    dy = 0
  } = args;

  return (index: number) => {
    const isCurrentlyDragged = isBeingDragged && index === initialIndex;

    /** Calculate the dy */
    const y = isCurrentlyDragged
      ? currentIndex * elementHeight + dy
      : order.indexOf(index) * elementHeight;

    /** Calculate the other drag-dependent styles */
    const scale = isCurrentlyDragged ? 1.1 : 1;
    const zIndex = isCurrentlyDragged ? 1 : 0;
    const cursor = isCurrentlyDragged ? "grabbing" : "grab";

    /** Which properties do we transition immediately */
    const immediate = ["y", "zIndex", "cursor"];

    /** Build our spring styles */
    return {
      y,
      scale,
      zIndex,
      cursor,
      immediate: !isCurrentlyDragged
        ? false
        : (key: string) => immediate.includes(key)
    };
  };
}

/** Resets the order to it's natural 0, 1, 2, ..., n sequence */
function naturalOrder(itemCount: number) {
  return new Array(itemCount).fill(undefined).map((_, i) => i);
}
