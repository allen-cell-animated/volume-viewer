# AICS Image Viewer

This is a browser based volume viewer built with React and WebGL (Three.js).
Volume data is provided to the core 3d viewer via a json file containing dimensions and other metadata, and texture atlases (png files containing volume slices tiled across the 2d image).
Therefore the texture atlases must be prepared in advance before loading into this viewer.
There is a server component (aics-image-viewer-service) that can open OME-TIFF, TIFF, and CZI files and generate texture atlases for viewing.  Currently the server component is required.  The viewer sends Allen Institute file paths to the server component, which opens the files and caches the texture atlases, returning the server path to that data.

The volume shader itself is a heavily modified version of one that has its origins in [Bisque](http://bioimage.ucsb.edu/bisque).

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

