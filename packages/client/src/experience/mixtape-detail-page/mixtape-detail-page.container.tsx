import { useCallback, useMemo, useState } from "react";

import { PropsOf } from "@emotion/react";
import { useSnapshot } from "valtio";

import { FirestoreMixtapeDatastore } from "../../datastores/datastore.firestore";
import {
  GlobalPlayerDatastore,
  onTogglePlay
} from "../../datastores/datastore.global-player";
import { TrackListing } from "../../modules/track-listing";
import { VanillaView } from "../../modules/vanilla-view";
import { Frame } from "./mixtape-detail-page.styles";

type TrackListingProps = PropsOf<typeof TrackListing>;

interface Props {
  /** The mixtape we want to show */
  mixtapeId: string;
}

export const MixtapeDetailPage: React.FC<Props> = ({ mixtapeId }) => {
  /** Retrieve the mixtape ID from Firestore */
  const mixtape = useSnapshot(
    FirestoreMixtapeDatastore[mixtapeId as "fixture-mixtape-1"]
  );

  /** Retrieve from the global player the "now playing" and play history */
  const { playState: globalPlayState, ...globalPlayerDatastore } = useSnapshot(
    GlobalPlayerDatastore
  );

  /** Track if the customer enters the edit-mode or drag-mode */
  const [trackListingMode, setTrackListingMode] =
    useState<TrackListingProps["mode"]>("readonly");

  /** When you change the mode of the track listing, we need to kill the player */
  const onChangeMode: TrackListingProps["onChangeMode"] = useCallback(
    nextMode => {
      /** Set the player to null if we're leaving readonly */
      nextMode !== "readonly" && onTogglePlay(null);
      /** Update the state mode */
      setTrackListingMode(nextMode);
    },
    []
  );

  /** Build out the props for the track listing */
  const trackListingProps: TrackListingProps = useMemo(
    () => ({
      mode: trackListingMode,
      tracks: mixtape.tracks,
      onDragEnd: mixtape.onSortMixtape.bind(mixtape),
      onAddTrack: mixtape.onAddTrack.bind(mixtape),
      onChangeMode,
      onTogglePlay,
      globalPlayState,
      ...globalPlayerDatastore
    }),
    [
      globalPlayState,
      globalPlayerDatastore,
      mixtape,
      onChangeMode,
      trackListingMode
    ]
  );

  return (
    <VanillaView>
      <Frame>
        <TrackListing {...trackListingProps} />
      </Frame>
    </VanillaView>
  );
};
