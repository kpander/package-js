# packager-js

Utility scripts for creating distribution package versions of javascript files.

A distribution version will:
  - be minified and uglified
  - have a header indicating the source repo URL
  - have a header with the filename, version # and creation timestamp


# Installation

```bash
$ npm install --save-dev @kpander/packager-js
```


# Usage

Your build script needs to supply the contents of your `package.json` file. This is used to determine the URL (from the `homepage.url` key) and version number.

E.g.:

This script will take 2 input files:
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


