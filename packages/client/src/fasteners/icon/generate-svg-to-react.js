/**
 * Convert raw SVGs to light touch React components.
 * This let's us lazy load them dynamically via React's native lazy API.
 *
 * @author Max Barry <@max-barry>
 * @since March 2021
 */
const { readFileSync, writeFileSync } = require("fs");
const { dirname, basename, join } = require("path");

const glob = require("glob");
const { parse: parseSvg } = require("node-html-parser");

const ROOT_SVG_DIRECTORY = join(__dirname, "./svgs");

function createSvgToJsx() {
  glob(`${ROOT_SVG_DIRECTORY}/**/*.svg`, async (_, files) => {
    for (const filepath of files) {
      // Read and parse
      const contents = readFileSync(filepath, { encoding: "utf-8" });
      const parsed = parseSvg(contents);

      // Does this have a viewBox
      const hasViewBox = parsed.firstChild.hasAttribute("viewBox");

      if (!hasViewBox) console.log(`Missing viewBox: ${filepath}`);

      // If it does then take off the height and width
      parsed.firstChild.removeAttribute("height");
      parsed.firstChild.removeAttribute("width");

      // Remove the enable-backround
      parsed.firstChild.removeAttribute("enable-background");

      // Create a .component
      const componentContent = `
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const Svg = (props) => (
    ${parsed
      .toString()
      .replace("<svg ", "<svg {...props} ")
      .replaceAll("fill-rule", "fillRule")
      .replaceAll("clip-rule", "clipRule")}
);

export default Svg;
    `;

      // Make the outfile
      const outdir = dirname(filepath);
      const filename = basename(filepath).replace(".svg", "");
      const outfile = join(outdir, `${filename}.component.jsx`);

      // Write it
      writeFileSync(outfile, componentContent);
    }
  });
}

createSvgToJsx();

module.exports.ROOT_SVG_DIRECTORY = ROOT_SVG_DIRECTORY;
