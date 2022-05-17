/**
 * Once icons have been generated, we dynamically build a type interface
 * in order to give our icon loading container some type-safety and improve DX.
 *
 * @author Max Barry <@max-barry>
 * @since March 2021
 */

const { writeFileSync } = require("fs");
const { basename, join } = require("path");

const glob = require("glob");
const { pascalCase } = require("pascal-case");

const { ROOT_SVG_DIRECTORY } = require("./generate-svg-to-react");

function createTypeInterfaces() {
  glob(`${ROOT_SVG_DIRECTORY}/**/*.svg`, async (_, files) => {
    const collections = {};
    const collectionRe = new RegExp(`${ROOT_SVG_DIRECTORY}/([a-z|_]+)/`);

    files.forEach(filepath => {
      const name = basename(filepath).replace(".svg", "");
      const [, collection] = filepath.match(collectionRe);

      if (!(collection in collections)) collections[collection] = {};

      collections[collection][name] = name;
    });

    function namesAsPairs(names) {
      return Object.values(names) // eslint-disable-line
        .map(name => `"${name}": "${name}";`) // eslint-disable-line
        .join("");
    }

    /** Write the collection interfaces */
    const collectionInterfaces = Object.entries(collections)
      .map(
        ([collection, names]) => `
      interface ${pascalCase(collection)} {
        ${namesAsPairs(names)}
      }
    `
      )
      .join("");

    const availableIcons = `
    export interface AvailableIcons {
    ${Object.keys(collections)
      .map(collection => `${collection}: ${pascalCase(collection)};`)
      .join("")}
    }`;

    // Combine
    const content = `
      /* eslint-disable camelcase */
      ${availableIcons}
      ${collectionInterfaces}
    `;

    // Write
    const outfile = join(ROOT_SVG_DIRECTORY, "./icon.types.ts");
    writeFileSync(outfile, content);
  });
}

createTypeInterfaces();
