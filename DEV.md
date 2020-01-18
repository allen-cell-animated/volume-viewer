# Developing

## Local Dev Setup

- make sure node.js is installed
- make sure aicsimage python lib is installed
- `npm install`
- `npm run dev`
- supports ome.tif, .tif, and .czi provided they are self contained z stacks.
- note: the files will be placed in a temporary "cache" folder which should be periodically cleaned out.

## Deugging React setup
This will make a simple react app with the volume viewer installed.
- make sure node.js is installed
- make sure aicsimage python lib is installed
- `npm install`
- `npm run build`
- `npm run react-example`
- Open localhost:9030/volumeviewer/
- supports ome.tif, .tif, and .czi provided they are self contained z stacks.
- note: the files will be placed in a temporary "cache" folder which should be periodically cleaned out.


## Publishing
* Requires that you are listed as a maintainer for this npm module

- Commit and push changes
- Login: `npm login`
- Make sure you can run build successfully: `npm run build`
- Update version: `npm version patch`
- Publish: `npm publish`
