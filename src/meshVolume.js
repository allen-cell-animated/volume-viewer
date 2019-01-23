import { defaultMaterialSettings } from './constants/materials.js';

import FileSaver from './FileSaver.js';
import NaiveSurfaceNets from './NaiveSurfaceNets.js';
import './MarchingCubes.js';
import './STLBinaryExporter.js';

import 'three/examples/js/exporters/GLTFExporter.js';

export default class MeshVolume {
    constructor(volume) {
        // need?
        this.volume = volume;

        this.meshRoot = new THREE.Object3D();//create an empty container
        this.meshRoot.name = "Mesh Surface Container";

        this.meshrep = [];

    }

    cleanup() {
        for (var i = 0; i < this.volume.num_channels; ++i) {
            this.destroyIsosurface(i);
        }
    }

    setVisible(isVisible) {
        this.meshRoot.visible = isVisible;
    }

    doRender(canvas) {
    }

    get3dObject() {
        return this.meshRoot;
    }

    onChannelData(batch) {
        for (var j = 0; j < batch.length; ++j) {
            var idx = batch[j];
            // if an isosurface was created before the channel data arrived, we need to re-calculate it now.
            if (this.meshrep[idx]) {
              this.updateIsovalue(idx, this.getIsovalue(idx));
            }
          }
    }

    appendEmptyChannel(name) {
    }

    setScale(scale) {

        this.scale = scale;

        this.meshRoot.scale.copy(new THREE.Vector3(0.5 * scale.x,
            0.5 * scale.y,
            0.5 * scale.z));
    }

    setResolution(viewObj) {
    }

    setOrthoThickness(value) {
    }
    
    setAxisClip(axis, minval, maxval, isOrthoAxis) {
    }

    //////////////////////////////

    updateMeshColors(channel_colors) {
        for (var i = 0; i < this.volume.num_channels; ++i) {
          if (this.meshrep[i]) {
            var rgb = channel_colors[i];
            const c = (rgb[0] << 16) | (rgb[1] << 8) | (rgb[2]);
      
            this.meshrep[i].traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                child.material.color = new THREE.Color(c);
              }
            });
            if (this.meshrep[i].material) {
              this.meshrep[i].material.color = new THREE.Color(c);
            }
          }
        }
    }

    createMaterialForChannel(rgb, alpha, transp) {
        const col = (rgb[0] << 16) | (rgb[1] << 8) | (rgb[2]);
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(col),
          shininess: defaultMaterialSettings.shininess,
          specular: new THREE.Color(defaultMaterialSettings.specularColor),
          opacity: alpha,
          transparent: (alpha < 0.9)
        });
        return material;
    }
      
    createMeshForChannel(channelIndex, colorrgb, isovalue, alpha, transp) {
        const geometries = this.generateIsosurfaceGeometry(channelIndex, isovalue);
        const material = this.createMaterialForChannel(colorrgb, alpha, transp);
      
        let theObject = new THREE.Object3D();
        theObject.name = "Channel"+channelIndex;
        theObject.userData = {isovalue:isovalue};
        // proper scaling will be done in parent object
        for (var i = 0; i < geometries.length; ++i) {
          let mesh = new THREE.Mesh( geometries[i], material );
          theObject.add(mesh);
        }
        return theObject;
    }

    updateIsovalue(channel, value) {
        if (!this.meshrep[channel]) {
          return;
        }
        if (this.meshrep[channel].userData.isovalue === value) {
          return;
        }
      
        // find the current isosurface opacity.
        let opacity = 1;
        if (this.meshrep[channel].material) {
          opacity = this.meshrep[channel].material.opacity;
        }
        else {
          this.meshrep[channel].traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              opacity = child.material.opacity;
            }
          });
        }
        this.destroyIsosurface(channel);
// TODO get color in there
        this.meshrep[channel] = this.createMeshForChannel(channel, value, opacity, false);
      
        this.meshRoot.add(this.meshrep[channel]);
    }

    getIsovalue(channel) {
        if (!this.meshrep[channel]) {
            return undefined;
        }
        return this.meshrep[channel].userData.isovalue;
    }

    updateOpacity(channel, value) {
        if (!this.meshrep[channel]) {
          return;
        }
      
        this.meshrep[channel].traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.material.opacity = value;
            child.material.transparent = (value < 0.9);
            //child.material.depthWrite = !child.material.transparent;
          }
        });
        if (this.meshrep[channel].material) {
          this.meshrep[channel].material.opacity = value;
          this.meshrep[channel].material.transparent = (value < 0.9);
          //this.meshrep[channel].material.depthWrite = !this.meshrep[channel].material.transparent;
        }
    }
      
    hasIsosurface(channel) {
        return (!!this.meshrep[channel]);
    }

    createIsosurface(channel, value, alpha, transp) {
        if (!this.meshrep[channel]) {
          if (alpha === undefined) {
            alpha = 1.0;
          }
          if (transp === undefined) {
            transp = (alpha < 0.9);
          }
          this.meshrep[channel] = this.createMeshForChannel(channel, value, alpha, transp);
          this.meshRoot.add(this.meshrep[channel]);
        }
    }
     
    destroyIsosurface(channel) {
        if (this.meshrep[channel]) {
          this.meshRoot.remove(this.meshrep[channel]);
          this.meshrep[channel].traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              child.material.dispose();
              child.geometry.dispose();
            }
          });
          if (this.meshrep[channel].geometry) {
            this.meshrep[channel].geometry.dispose();
          }
          if (this.meshrep[channel].material) {
            this.meshrep[channel].material.dispose();
          }
          this.meshrep[channel] = null;
        }
    }
      
    saveChannelIsosurface(channelIndex, type, namePrefix) {
        if (!this.meshrep[channelIndex]) {
          return;
        }
      
        if (type === "STL") {
          this.exportSTL(this.meshrep[channelIndex], namePrefix+"_"+this.volume.channel_names[channelIndex]);
        }
        else if (type === "GLTF") {
          // temporarily set other meshreps to invisible
          var prevviz = [];
          for (var i = 0; i < this.meshrep.length; ++i) {
            if (this.meshrep[i]) {
                prevviz[i] = this.meshrep[i].visible;
                this.meshrep[i].visible = (i === channelIndex);
              }
          }
          this.exportGLTF(this.meshRoot, namePrefix+"_"+this.volume.channel_names[channelIndex]);
          for (var i = 0; i < this.meshrep.length; ++i) {
            if (this.meshrep[i]) {
              this.meshrep[i].visible = prevviz[i];
            }
          }
        }
    }

    exportSTL( input, fname ) {
        var ex = new THREE.STLBinaryExporter();
        var output = ex.parse(input);
        FileSaver.saveBinary(output.buffer, fname+'.stl');
    }
      
    // takes a scene or object or array of scenes or objects or both!
    exportGLTF( input, fname ) {
        var gltfExporter = new THREE.GLTFExporter();
        var options = {
          // transforms as translate rotate scale?
          trs: false,
          onlyVisible: true,
          truncateDrawRange: true,
          binary: true,
          forceIndices: false,
          forcePowerOfTwoTextures: true
        };
        gltfExporter.parse( input, function( result ) {
          if ( result instanceof ArrayBuffer ) {
            FileSaver.saveArrayBuffer( result, fname + '.glb' );
          } else {
            var output = JSON.stringify( result, null, 2 );
            FileSaver.saveString( output, fname + '.gltf' );
          }
        }, options );
    }
      
    generateIsosurfaceGeometry(channelIndex, isovalue) {
        if (!this.volume) {
          return [];
        }
        const volumedata = this.volume.channels[channelIndex].volumeData;
      
        const marchingcubes = true;
      
        if (marchingcubes) {
          let effect = new THREE.MarchingCubes(
            [this.volume.x, this.volume.y, this.volume.z],
            null,
            false, false, true,
            volumedata
          );
          effect.position.set( 0, 0, 0 );
          effect.scale.set( 0.5 * this.scale.x, 0.5 * this.scale.y, 0.5 * this.scale.z );
          effect.isovalue = isovalue;
          var geometries = effect.generateGeometry();
          // TODO: weld vertices and recompute normals if MarchingCubes results in excessive coincident verts
          // for (var i = 0; i < geometries.length; ++i) {
          //   var g = new THREE.Geometry().fromBufferGeometry(geometries[i]);
          //   g.mergeVertices();
          //   geometries[i] = new THREE.BufferGeometry().fromGeometry(g);
          //   geometries[i].computeVertexNormals();
          // }
          return geometries;
        }
        else {
          var result = NaiveSurfaceNets.surfaceNets(
            volumedata,
            [this.volume.x, this.volume.y, this.volume.z],
            isovalue
          );
          return NaiveSurfaceNets.constructTHREEGeometry(result);
        }
      
    }
                  
};
