/**
 * @note: this has been pulled for static fixtures in mixtaped-isol
 *        For this reason, a lot of this page is a junky fast fixture reproduction of Firestore.
 */
import { proxy, snapshot } from "valtio";

import _episodesFixture from "./__fixtures__/firestore-tracks.json";
import _artistFixture from "./__fixtures__/firestore-artists.json";

export const FIXTURE_MIXTAPE_ID = "fixture-mixtape-1";

/**
 * *********************************************************
 * Artists & episodes (e.g. individual shows) from Firestore
 * *********************************************************
 */

const FIXTURE_DATA_EPISODES: Mixtaped.Database.TrackStore[] = _episodesFixture;

const FIXTURE_DATA_ARTISTS: Mixtaped.Database.ArtistStore[] =
  _artistFixture.map(fixture => ({
    name: fixture.collectionName,
    artist: fixture.artistName,
    artistId: fixture.artistId!,
    artworkUrl30: fixture.artworkUrl30,
    artworkUrl60: fixture.artworkUrl60,
    artworkUrl100: fixture.artworkUrl100,
    artworkUrl600: fixture.artworkUrl600
  }));

const FIXTURE_DATA_FEEDS: Mixtaped.FirestoreArtistDatastore["feeds"] =
  FIXTURE_DATA_ARTISTS.reduce(
    (acc, artist) => ({
      ...acc,
      [artist.artistId]: FIXTURE_DATA_EPISODES.filter(
        track => track.artistId === artist.artistId
      )
    }),
    {}
  );

const initialFirestoreArtistDatastore: Mixtaped.FirestoreArtistDatastore = {
  artists: FIXTURE_DATA_ARTISTS,
  feeds: FIXTURE_DATA_FEEDS
};

export const FirestoreArtistDatastore = proxy(initialFirestoreArtistDatastore);

/** Action to return a show by track ID */
export function retrieveTrackByTrackId(trackId: Mixtaped.Track["id"]) {
  /** Pull a snapshot of the datastore */
  const { feeds } = snapshot(FirestoreArtistDatastore);
  /** Get all tracks flattened */
  const tracks = Object.values(feeds).flat();
  /** Retrieve this track */
  const [thisTrack] = tracks.filter(track => track.id === trackId);
  /** Exit */
  return thisTrack;
}

/** Action to return a show by track ID */
export function retrieveArtistByTrackId(trackId: Mixtaped.Track["id"]) {
  /** Pull a snapshot of the datastore */
  const { artists } = snapshot(FirestoreArtistDatastore);
  /** Retrieve the track */
  const track = retrieveTrackByTrackId(trackId);
  /** Return the artist for this track */
  const [thisArtist] = artists.filter(
    artist => artist.artistId === track.artistId
  );
  /** Exit */
  return thisArtist;
}

/** Action to take a track and resolve it with the artist */
export function resolveTrackAndArtist(
  trackId: Mixtaped.Track["id"]
): Mixtaped.Track {
  /** Retrieve the track itself */
  const track = retrieveTrackByTrackId(trackId);
  /** Retrieve the artist of the track */
  const artist = retrieveArtistByTrackId(trackId);
  /** Return what we need */
  return { ...track, artist: artist.name, artworkUrl100: artist.artworkUrl100 };
}

/**
 * *********************
 * User created mixtapes
 * *********************
 */

/** Just a fast shuffle for fixture */
const FIXTURE_MIXTAPE_TRACKS = FIXTURE_DATA_EPISODES.sort(
  () => 0.5 - Math.random()
).slice(0, 5);

/** Set the initial store */
const initialFirestoreMixtapeDatastore = {};

/** Create a proxy of this */
export const FirestoreMixtapeDatastore = proxy(
  initialFirestoreMixtapeDatastore
);

/** Create a class representing our mixtape */
export class MixtapeRecord {
  _id: Mixtaped.Mixtape["id"];
  _tracks: Mixtaped.Database.TrackStore[] = [];

  constructor(id, initialTracks: Mixtaped.Database.TrackStore[]) {
    this._id = id;
    this._tracks = initialTracks;
  }

  get tracks() {
    return this._tracks.map(({ id }) => resolveTrackAndArtist(id));
  }

  /** Adds a track to this mixtape */
  onAddTrack(newTrackId: Mixtaped.Track["id"]) {
    /** Bounce this to the proxy */
    FirestoreMixtapeDatastore[this._id]._onAddTrack(newTrackId);
  }

  /** @temp: this is because we're using a fast-proxy service */
  _onAddTrack(newTrackId: Mixtaped.Track["id"]) {
    /** Find the track from this ID */
    const newTrack = retrieveTrackByTrackId(newTrackId);
    /** Add it if truly new */
    this._tracks = this._tracks.some(({ id }) => id === newTrack.id)
      ? this._tracks
      : [...this._tracks, newTrack];
  }

  /** Reorders this track to match the new ID */
  onSortMixtape(nextOrder: Mixtaped.Track["id"][]) {
    /** Bounce this to the proxy */
    FirestoreMixtapeDatastore[this._id]._onSortMixtapeOnProxy(nextOrder);
  }

  /** @temp: this is because we're using a fast-proxy service */
  _onSortMixtapeOnProxy(nextOrder: Mixtaped.Track["id"][]) {
    /** Re-set direct on the proxy */
    this._tracks = this._tracks.sort(
      (a, b) => nextOrder.indexOf(a.id) - nextOrder.indexOf(b.id)
    );
  }
}

if (!snapshot(FirestoreMixtapeDatastore)[FIXTURE_MIXTAPE_ID])
  FirestoreMixtapeDatastore[FIXTURE_MIXTAPE_ID] = new MixtapeRecord(
    FIXTURE_MIXTAPE_ID,
    FIXTURE_MIXTAPE_TRACKS
  );
