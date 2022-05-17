declare namespace Mixtaped {
  type DurationWithMinutes = `${string | "--"}:${string | "--"}`;
  type DurationWithHours = `${string | "--"}:${string | "--"}:${string | "--"}`;

  interface GlobalPlayerDatastore {
    /** What is currently playing? */
    nowPlaying: Database.TrackStore["id"] | null;
    /** What has historically played? */
    hasPlayed: Database.TrackStore["id"][];
    /** What state is the player in? */
    playState: "playing" | "paused";
    /** What is the duration of each played track */
    durations: { [key: Database.TrackStore["id"]]: number | undefined };
    /** What is the remaining of each played track */
    remainings: { [key: Database.TrackStore["id"]]: number | undefined };
  }

  type Track = Database.TrackStore & {
    artist: Database.ArtistStore["name"];
    artworkUrl100: Database.ArtistStore["artworkUrl100"];
  };

  interface Mixtape {
    id: string;
    tracks: Track[];
  }

  interface FirestoreArtistDatastore {
    artists: Database.ArtistStore[];
    feeds: {
      [artistId: Database.ArtistStore["artistId"]]: Database.TrackStore[];
    };
  }

  namespace Database {
    interface ArtistStore {
      name: string;
      artistId: number;
      artworkUrl30: string;
      artworkUrl60: string;
      artworkUrl100: string;
      artworkUrl600: string;
    }

    interface TrackStore {
      id: string;
      artistId: number;
      name: string;
      description: string;
      pubDate: string;
      link?: string | undefined;
      enclosure: {
        url: string;
        type: string;
        length?: string;
      };
    }
  }
}
