import { useCallback, useDeferredValue, useMemo, useState } from "react";

import { PropsOf } from "@emotion/react";
import { useSnapshot } from "valtio";
/** @hack: stand in for Algolia work */
import Fuse from "fuse.js";

import { AddTrackComponent } from "./add-track.component";
import {
  FirestoreArtistDatastore,
  resolveTrackAndArtist
} from "../../../datastores/datastore.firestore";
import { shuffle } from "../../../fasteners/utility-fns/utility-fns.primitives";

type AddTrackComponentProps = PropsOf<typeof AddTrackComponent>;

interface Props {
  onExit: AddTrackComponentProps["onExit"];
  onSelect: AddTrackComponentProps["onSelect"];
}

const MAXIMUM_RESULTS_TO_DISPLAY = 5;

const FUSE_OPTIONS: Fuse.IFuseOptions<Mixtaped.Track> = {
  minMatchCharLength: 2,
  shouldSort: true,
  keys: ["name", "artist"]
};

export const AddTrack: React.FC<Props> = ({ onExit, onSelect: _onSelect }) => {
  /** Track in state the current search term */
  const [searchTerm, setSearchTerm] = useState("");

  /** Defer this value for better Algolia search */
  const deferredSearchTerm = useDeferredValue(searchTerm);

  /** Retrieve a list of all tracks */
  const { feeds } = useSnapshot(FirestoreArtistDatastore);

  /** Resolve the feeds with the artists */
  const allTracks = Object.values(feeds).flatMap(tracks =>
    tracks.map(track => resolveTrackAndArtist(track.id))
  );

  /** @hack choose a random 5 to start with */
  const [initialTracksResults] = useState(shuffle(allTracks));

  /** @hack stubs out what we normally do in Algolia */
  const allTracksSearchable = useMemo(
    () => new Fuse(allTracks, FUSE_OPTIONS),
    [allTracks]
  );

  /** @hack stubs out what we normally do in Algolia */
  const results: AddTrackComponentProps["results"] = useMemo(
    () =>
      deferredSearchTerm === ""
        ? initialTracksResults
        : allTracksSearchable
            .search(deferredSearchTerm)
            .map(({ item }) => item),
    [allTracksSearchable, deferredSearchTerm, initialTracksResults]
  );

  /** Callback to save the added track and exit */
  const onSelect: AddTrackComponentProps["onSelect"] = useCallback(
    (...args) => {
      /** Call up the addition */
      _onSelect(...args);
      /** Exit */
      onExit();
    },
    [_onSelect, onExit]
  );

  return (
    <AddTrackComponent
      results={results.slice(0, MAXIMUM_RESULTS_TO_DISPLAY)}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      onExit={onExit}
      onSelect={onSelect}
    />
  );
};
