"use strict";
/**
 * @file
 * packager.js
 *
 * Create distribution versions of javascript files.
 * Uglify and add a url/version/timestamp header.
 */

const fs = require("fs");
const path = require("path");
const uglify = require("uglify-js");

let packagejson = null;

/**
 * Provide the package.json object.
 *
 * Required to set values in the distribution file header.
 */
const setPackageJson = function(json) {
  packagejson = json;
};

/**
 * Process a given javascript input_file. Minify it, add a distribution
 * header, and save it to output_file.
 */
const process = function(input_file, output_file) {
  if (packagejson === null) {
    const msg = `packager.js: package.json not provided for (${input_file}) -- aborting!`;
    throw new Error(msg);
  }

  const input = fs.readFileSync(input_file, "utf8");
  const output = _addHeader(uglify.minify(input).code, output_file);

  fs.writeFileSync(output_file, output, "utf8");
  console.log("Wrote", output_file);
};

/**
 * Add the distribution header to the given minified code.
 */
const _addHeader = function(code, filename) {
  return `
${_getHeader(filename)}

${code}
`.trim();
};

/**
 * Get the distribution header for a given filename.
 */
const _getHeader = function(output_file) {
  let header = `
/* {{url}} */
/* {{output_file}} v{{version}} {{date}} */
`.trim();

  const datetime = new Date().toString();

  return header
    .replace(/{{url}}/, packagejson.homepage)
    .replace(/{{output_file}}/, output_file)
    .replace(/{{version}}/, packagejson.version)
    .replace(/{{date}}/, datetime)
  ;
}

module.exports = {
  setPackageJson: setPackageJson,
  process: process,
};
