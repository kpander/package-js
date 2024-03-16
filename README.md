# packager-js

Utility scripts for creating distribution package versions of javascript files.

A distribution version will:
  - be minified and uglified
  - have a header indicating the source repo URL
  - have a header with the filename, version # and creation timestamp


# Installation

## With `npm`

If you're installing via `npm`... Ensure your project has an `.npmrc` file in the project root to tell `npm` where to find the package. Ensure the following line exists:

```
@kpander:registry=https://npm.pkg.github.com/
```

Then:

```bash
$ npm install --save-dev @kpander/packager-js
```


# Usage

Your build script needs to supply the contents of your `package.json` file. This is used to determine the URL (from the `homepage.url` key) and version number.

E.g.:

This example (build.js) will take 2 input files:
  - `src/PanZoom.js`
  - `src/PanZoom.UI.Drag.js`

It will output the distribution versions of those files here:
  - `dist/PanZoom.min.js`
  - `dist/PanZoom.UI.Drag.min.js`

**build.js**

```js
const packager = require("@kpander/packager-js");

packager.setPackageJson(require("./package.json"));
packager.process("src/PanZoom.js", "dist/PanZoom.min.js");
packager.process("src/PanZoom.UI.Drag.js", "dist/PanZoom.UI.Drag.min.js");
```

```bash
$ node build.js
```


# Example

Assume:
  - Your source file is named `hellowWorld.js`
  - It's in a project with a package.json with:
    - `homepage: "https://github.com/kpander/MyAwesomeProject"`
    - `version: "2.1.5"`

Your source file looks like:

```js
/* I am a simple test script */
console.log("Hello, world");
const x = 1;
console.log(x + 1);
```

The 'packaged' version will look something like this:

```js
/* https://github.com/kpander/MyAwesomeProject */
/* dist/helloWorld.js v2.1.5 Wed Aug 23 2023 11:05:47 GMT-0400 (Eastern Daylight Saving Time) */

console.log("Hello, world");const x=1;console.log(x+1);
```


# Tests

Jest tests exist in the `test` folder. Run via:

```bash
$ npm run test
```

Currently only tests for the happy path exist.

