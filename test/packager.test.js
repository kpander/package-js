"use strict";
/*global test, expect*/
/**
 * @file
 * packager.test.js
 */

const packager = require("../src/packager");
const fs = require("fs");
const path = require("path");
const tmp = require("tmp");

// ---

const createPackageJson = function() {
  const json = {
    "version": "1.0.2",
    "homepage": "https://github.com/kpander/packager-js",
  };

  return json;
}

const createJS = function(path_tmp, filename) {
  const js = `
console.log   (     "a simple file to test minification"    )   ;

/*
 * a long set of comments to ensure the source file size is larger
 * than the output file size. all of this will be stripped during
 * packaging.
 *
 * a long set of comments to ensure the source file size is larger
 * than the output file size. all of this will be stripped during
 * packaging.
 *
 * a long set of comments to ensure the source file size is larger
 * than the output file size. all of this will be stripped during
 * packaging.
 *
 * a long set of comments to ensure the source file size is larger
 * than the output file size. all of this will be stripped during
 * packaging.
 *
 */
`.trim();

  fs.writeFileSync(path.join(path_tmp, filename), js, "utf8");

  return path.join(path_tmp, filename);
};

const getTimestampStr = function() {
  // Timestamp will be in format:
  // Dayofweek Month DayNum YearNum HH:MM:SS ...
  // So, we just want to match on the first 4 items:
  // - day of week, month, day, year
  const items = new Date().toString().split(" ");
  return [ items[0], items[1], items[2], items[3] ].join(" ");
};

// ---

test(
  `[packager-001]
  Given
    - a package.json file with a homepage and version defined
    - an input file defined
    - an output file defined
  When
    - we run process()
  Then
    - the input file is minified (output is smaller than input)
    - the package URL is in a header comment
    - the packager version is in a header comment
    - the timestamp is in a header comment
`.trim(), async() => {
  // Given...
  const path_src = tmp.dirSync().name;
  const path_dest = tmp.dirSync().name;
  const json = createPackageJson(path_src);
  const file_js = createJS(path_src, "test.js");
  const file_js_processed = path.join(path_dest, "test.min.js");

  // When...
  packager.setPackageJson(json);
  packager.process(file_js, file_js_processed);
  const contents = fs.readFileSync(file_js_processed, "utf8");

  // Then...
  // ... the distribution file should have been created
  expect(fs.existsSync(file_js_processed)).toEqual(true);
  expect(contents.length).toBeGreaterThan(0);

  // ... it should be minified
  const stats_src = fs.statSync(file_js);
  const stats_processed = fs.statSync(file_js_processed);
  expect(stats_processed.size).toBeLessThan(stats_src.size);
  expect(contents.indexOf(`console.log("`)).toBeGreaterThan(0);
  expect(contents.indexOf(`console.log  `)).toEqual(-1);

  // ... it should include the package version, homepage, and filename
  expect(contents.indexOf(json.homepage)).toBeGreaterThan(0);
  expect(contents.indexOf(json.version)).toBeGreaterThan(0);
  expect(contents.indexOf("test.min.js")).toBeGreaterThan(0);

  // ... confirm the timestamp is present, for today
  expect(contents.indexOf(getTimestampStr())).toBeGreaterThan(0);
});

/*
 * @todo -- the non-happy path tests
 *
 * e.g.:
 * - packagejson not provided
 * - packagejson not an object
 * - packagejson doesn't include homepage key, or version key
 * - input file missing
 * - output folder doesn't exist
 * - output folder not writable
 */

