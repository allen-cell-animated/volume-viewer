# AICS Volume Viewer

This is a WebGL canvas-based volume viewer. It can display multichannel volume data of 8-bit intensity values.
Volume data is provided to the core 3d viewer in two parts. The first part is via a json object containing dimensions and other metadata. The second part is the volume data itself.

The volume-viewer package exposes two key modules:

- `View3d` is the viewing component that contains a canvas and supports zoom/pan/rotate interaction with the volume.
- `Volume` is the class that holds the volume data. After initialization, this is generally a read-only holder for raw data.

It also provides the following two utility modules:

- `VolumeLoader` is a convenience class for downloading and unpacking texture atlases from .png files (up to 3 channels per png) into a Volume.
- `VolumeMaker` is a convenience module for creating simple test volume data

There are two ways to deliver volume data to the viewer:

- raw Uint8Arrays of 3d volume data (one Uint8Array per channel). ( `Volume.setChannelDataFromVolume` )
- texture atlases (png files or Uint8Arrays containing volume slices tiled across a 2d image) ( `Volume.setChannelDataFromAtlas` )

# Example

See public/index.ts for a working example. (`npm install; npm run dev` will run that code) The basic code to get the volume viewer up and running is as follows:

```javascript
import { View3d, Volume, VolumeLoader, VolumeMaker } from "volume-viewer";

// find a div that will hold the viewer
const el = document.getElementById("volume-viewer");

// create the viewer.  it will try to fill the parent element.
const view3D = new View3d(el);

// create a volume image with dimensions passed in via jsondata
// this json format is documented in Volume.ts as ImageInfo
const aimg = new Volume(jsondata);

// tell the viewer about the image
view3D.addVolume(aimg);

// load volume data into the image.  volumeData here is an array of Uint8Arrays.
// each element in volumeData is a flattened 3d volume stored in xyz order in a Uint8Array.
// Intensities must have been be scaled to fit in uint8.
for (let i = 0; i < volumeData.length; ++i) {
  aimg.setChannelDataFromVolume(i, volumeData[i], [0, 255]);
  // optional: initialize with a lookup table suitable for visualizing noisy biological data
  const hmin = aimg.getHistogram(i).findBinOfPercentile(0.5);
  const hmax = aimg.getHistogram(i).findBinOfPercentile(0.983);
  const lut = new Lut().createFromMinMax(hmin, hmax);
  aimg.setLut(i, lut.lut);
}

// enable only the first 3 channels
for (var ch = 0; ch < aimg.num_channels; ++ch) {
  view3D.setVolumeChannelEnabled(aimg, ch, ch < 3);
}

// set some viewing parameters
view3D.updateDensity(aimg, 0.05);
view3D.updateExposure(0.75);
// tell the viewer to update because new data has been added.
view3D.updateActiveChannels(aimg);
view3D.updateLuts(aimg);
```

# React example

- in `VolumeViewer.jsx`

```JavaScript
import * as React from "react";

import { View3d, Volume, VolumeLoader, VolumeMaker } from 'volume-viewer';


const url = 'https://s3-us-west-2.amazonaws.com/bisque.allencell.org/v1.4.0/Cell-Viewer_Thumbnails/AICS-11/';
const volumeToLoad = 'AICS-11_3136_atlas.json';
export class VolumeViewer extends React.Component {
    constructor(props) {
        super(props);
        this.volumeViewer = React.createRef();
    }

    componentDidMount() {
        const ref = this.volumeViewer;
        if (!ref.current) {
            return;
        }
        const el = ref.current;
        this.view3D = new View3d(el);
        // to download a volume encoded as a json plus tiled png images:
        // this format is documented in Volume.ts as ImageInfo
        return fetch(`${url}/${volumeToLoad}`)
            .then((response) => {
                return response.json();
            })
            .then(jsondata => {
                // when json file is received, create Volume object
                const aimg = new Volume(jsondata);
                // tell the 3d view about it.
                this.view3D.addVolume(aimg);

                jsondata.images = jsondata.images.map(img => ({ ...img, name: `${url$}${img.name}` }));
                // download the volume data itself in the form of tiled png files
                VolumeLoader.loadVolumeAtlasData(aimg, jsondata.images, (url, channelIndex) => {
                    // initialize each channel as it arrives and tell the view to update.
                    const hmin = aimg.getHistogram(channelIndex).findBinOfPercentile(0.5);
                    const hmax = aimg.getHistogram(channelIndex).findBinOfPercentile(0.983);
                    const lut = new Lut().createFromMinMax(hmin, hmax);
                    aimg.setLut(i, lut.lut);

                    this.view3D.setVolumeChannelEnabled(aimg, channelIndex, channelIndex < 3);
                    this.view3D.updateActiveChannels(aimg);

                    this.view3D.updateLuts(aimg);
                });
                // set some initial viewing parameters
                this.view3D.setCameraMode('3D');
                this.view3D.updateDensity(aimg, 0.05);
                this.view3D.updateExposure(0.75);
            });
    }

    render() {
        return (
            <div
                style={{height: 1000, width: '100%'}}
                ref={this.volumeViewer}
            />
        )
    }
```

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
