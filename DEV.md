# Developing

## Local Dev Setup

- make sure node.js is installed
- make sure aicsimage python lib is installed
- `npm install`
- `npm run dev`
- supports ome.tif, .tif, and .czi provided they are self contained z stacks.
- note: the files will be placed in a temporary "cache" folder which should be periodically cleaned out.

## Publishing

- Requires that you are listed as a maintainer for this npm module

* Make sure you can run build successfully: `npm run build`
* Update version: `npm version patch`
* Push to main: `git push origin main`
* Push tags: `git push origin --tags vX.X.X`

You do not need to run `npm publish` as the CI/CD pipeline will automatically publish the package to npm.
