/**
 * Types for styled-breakpoints need overloading,
 * to match up with the names of the keys we use vs. the default key names.
 */
import "styled-breakpoints";
import { Orientation } from "styled-breakpoints/styled-breakpoints";

import { MEDIA_QUERY_BREAK_POINT_KEYS } from "../src/fasteners/styles/parts/styles.media-queries";

declare module "styled-breakpoints" {
  export function up(
    min: MEDIA_QUERY_BREAK_POINT_KEYS,
    orientation?: Orientation
  ): any;

  export function down(
    max: MEDIA_QUERY_BREAK_POINT_KEYS,
    orientation?: Orientation
  ): any;

  export function between(
    min: MEDIA_QUERY_BREAK_POINT_KEYS,
    max: MEDIA_QUERY_BREAK_POINT_KEYS,
    orientation?: Orientation
  ): any;

  export function only(
    name: MEDIA_QUERY_BREAK_POINT_KEYS,
    orientation?: Orientation
  ): any;
}
