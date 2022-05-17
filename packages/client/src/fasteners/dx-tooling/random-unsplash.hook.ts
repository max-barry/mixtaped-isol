/**
 * Get a random image from unsplash.
 * Useful for development situations where we don't quite have media in place.
 *
 * @author Max Barry <@max-barry>
 */
export function unsplash(width = 1600, height = 900, collection = 542632) {
  const dimensions = [width, height].filter(Boolean).join("x");
  return `https://source.unsplash.com/collection/${collection}/${dimensions}
  `;
}
