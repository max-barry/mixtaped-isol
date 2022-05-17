import { format } from "date-fns";

/**
 * Makes a URL much prettier than it's usual extended form.
 * @author Max Barry <@max-barry>
 */
export function prettyUrl(url: string) {
  return new URL(url).host;
}

/**
 * Formats a date in a human readable way
 *
 * @example
 *  prettyDate("Fri, 29 Apr 2022 17:25:00 -0400") // April 29th, 2022
 *
 * @author Max Barry <@max-barry>
 */
export function prettyDate(dateStr: string) {
  return format(new Date(dateStr), "PPP");
}

/**
 * Formats seconds in audio to a "HH:MM" format.
 *
 * @example
 *  prettySeconds(1213.498276) // "00:20"
 *
 * @author Max Barry <@max-barry>
 */
export function prettySeconds(timing: number) {
  return timing > 0
    ? new Date(timing * 1000).toISOString().substring(11, 16)
    : "--";
}
