import { TRACK_LISTING_MODES } from "../../modules/track-listing/track-listing.types";

/** Is the current episode playing? "none" is the neutral state. */
export type CARD_SHOW_PLAY_STATES = TRACK_LISTING_MODES | "playing" | "paused";
