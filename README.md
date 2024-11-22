# Vol-E core

This is a WebGL canvas-based volume viewer. It can display multichannel volume data with high channel counts, and is optimized for OME-Zarr files. With OME-Zarr, the viewer can prefetch and cache Zarr chunks in browser memory for optimized performance.

The Vol-E core package exposes several key modules:

- `View3d` is the viewing component that contains a canvas and supports zoom/pan/rotate interaction with the volume via `VolumeDrawable`.
- `Volume` is the class that holds the volume dimensions and a collection of `Channel`s that contain the volume pixel data. After initialization, this is generally a read-only holder for raw data.
- `VolumeLoaderContext` is an interface that lets you initialize asynchronous data loading of different formats via its `createLoader` method
- `IVolumeLoader` is an interface for requesting volume dimensions and data.
- `LoadSpec` is a small bundle of information to guide the IVolumeLoader on exactly what to load.

There are several ways to deliver volume data to the viewer:

- load OME-Zarr as publicly accessible web links. Authentication is not explicitly supported in Vol-E.
- raw TypedArrays of 3d volume data ( see `RawArrayLoader` and `Volume.setChannelDataFromVolume` )
- (legacy) texture atlases as png files or Uint8Arrays containing volume slices tiled across a 2d image ( see `JsonImageInfoLoader` and `Volume.setChannelDataFromAtlas` )

# Example

See public/index.ts for a working example. (`npm install; npm run dev` will run that code)

The basic code to get the volume viewer up and running is as follows:

```javascript
// find a div that will hold the viewer
const el = document.getElementById("vol-e");

// create the loaderContext
const loaderContext = new VolumeLoaderContext(CACHE_MAX_SIZE, CONCURRENCY_LIMIT, PREFETCH_CONCURRENCY_LIMIT);

// create the viewer.  it will try to fill the parent element.
const view3D = new View3d(el);
view3D.loaderContext = loaderContext;

// ensure the loader worker is ready
await loaderContext.onOpen();
// get the actual loader.  In most cases this will create a WorkerLoader that uses a OmeZarrLoader internally.
const loader = await loaderContext.createLoader(path);

const loadSpec = new LoadSpec();
// give the loader a callback to call when it receives channel data asynchronously
const volume = await loader.createVolume(loadSpec, (v: Volume, channelIndex: number) => {
  const currentVol = v;

  // currently, this must be called!
  view3D.onVolumeData(currentVol, [channelIndex]);

  view3D.setVolumeChannelEnabled(currentVol, channelIndex, true);

  // these calls tell the viewer that things are out of date
  view3D.updateActiveChannels(currentVol);
  view3D.updateLuts(currentVol);
  view3D.redraw();
});
// tell the viewer about the image
view3D.addVolume(volume);
// start requesting volume data
loader.loadVolumeData(volume);
```

# React example

See vole-app for a complete application that wraps View3D in a React component.

# Acknowledgements

The ray marched volume shader is a heavily modified version of one that has its origins in [Bisque](http://bioimage.ucsb.edu/bisque).
The core path tracing implementation was adapted from ExposureRender.

## BisQue license

Center for Bio-Image Informatics, University of California at Santa Barbara

Copyright (c) 2007-2017 by the Regents of the University of California
All rights reserved

Redistribution and use in source and binary forms, in whole or in parts, with or without
modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright
    notice, this list of conditions, and the following disclaimer.

    Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions, and the following disclaimer in
    the documentation and/or other materials provided with the
    distribution.

    Use or redistribution must display the attribution with the logo
    or project name and the project URL link in a location commonly
    visible by the end users, unless specifically permitted by the
    license holders.

THIS SOFTWARE IS PROVIDED BY THE REGENTS OF THE UNIVERSITY OF CALIFORNIA ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OF THE UNIVERSITY OF CALIFORNIA OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation
are those of the authors and should not be interpreted as representing
official policies, either expressed or implied, of the Regents of the University of California.

## Exposure Render license

    Copyright (c) 2011, T. Kroes <t.kroes@tudelft.nl>
    All rights reserved.
    Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    - Neither the name of the TU Delft nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
