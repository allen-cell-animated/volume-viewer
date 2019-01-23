import AICSchannelData from './AICSchannelData.js';
import { 
    rayMarchingVertexShaderSrc, 
    rayMarchingFragmentShaderSrc, 
    rayMarchingShaderUniforms 
} from './constants/volumeRayMarchShader.js';
  
export default class RayMarchedAtlasVolume {
    constructor(volume) {
        // need?
        this.volume = volume;

        this.bounds = {
            bmin: new THREE.Vector3(-0.5, -0.5, -0.5),
            bmax: new THREE.Vector3(0.5, 0.5, 0.5)
        };
        
        this.cube = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        this.cubeMesh = new THREE.Mesh(this.cube);
        this.cubeMesh.name = "Volume";

        this.uniforms = rayMarchingShaderUniforms();

        // shader,vtx and frag.
        var vtxsrc = rayMarchingVertexShaderSrc;
        var fgmtsrc = rayMarchingFragmentShaderSrc;
      
        var threeMaterial = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: vtxsrc,
          fragmentShader: fgmtsrc,
          transparent: true,
          depthTest: false
        });
        this.cubeMesh.material = threeMaterial;

        this.setUniform("ATLAS_X", volume.imageInfo.cols);
        this.setUniform("ATLAS_Y", volume.imageInfo.rows);
        this.setUniform("SLICES", volume.z);
      
        this.channelData = new AICSchannelData(
            volume.imageInfo.atlas_width, 
            volume.imageInfo.atlas_height
        );
    }

    cleanup() {
        this.cube.dispose();
        this.cubeMesh.material.dispose();

        this.channelData.cleanup();
    }

    setVisible(isVisible) {
        this.cubeMesh.visible = isVisible;
    }

    doRender(canvas) {
        if (!this.cubeMesh.visible) {
            return;
        }

        this.cubeMesh.updateMatrixWorld(true);

        var mvm = new THREE.Matrix4();
        mvm.multiplyMatrices(canvas.camera.matrixWorldInverse, this.cubeMesh.matrixWorld);
        var mi = new THREE.Matrix4();
        mi.getInverse(mvm);
      
        this.setUniform('inverseModelViewMatrix', mi, true, true);
      
        const isVR = canvas.isVR();
        if (isVR) {
          this.cubeMesh.material.depthWrite = true;
          this.cubeMesh.material.transparent = false;
          this.cubeMesh.material.depthTest = true;
        }
        else {
          this.cubeMesh.material.depthWrite = false;
          this.cubeMesh.material.transparent = true;
          this.cubeMesh.material.depthTest = false;
        }
    }

    get3dObject() {
        return this.cubeMesh;
    }

    onChannelData(batch) {
        this.channelData.onChannelLoaded(batch, this.volume.channels);
    }

    appendEmptyChannel(name) {
        this.channelData.appendEmptyChannel(name);
    }

    setScale(scale) {

        this.scale = scale;

        this.cubeMesh.scale.copy(new THREE.Vector3(scale.x,
          scale.y,
          scale.z));

        // duplicated in doRender ?
        //this.cubeMesh.updateMatrixWorld(true);
        //var mi = new THREE.Matrix4();
        //mi.getInverse(this.cubeMesh.matrixWorld);
        //this.setUniform('inverseModelViewMatrix', mi, true, true);
    }

    setOrthoScale(value) {
        this.setUniform('orthoScale', value);
    }

    setResolution(viewObj) {
        const res = new THREE.Vector2(viewObj.getWidth(), viewObj.getHeight());
        this.setUniform('iResolution', res);
    }

    setDensity(density) {
        this.setUniform("DENSITY", density);
    }

    // TODO brightness and exposure should be the same thing?
    setBrightness(brightness) {
        this.setUniform("BRIGHTNESS", brightness);
    }
      
    setAxisClip(axis, minval, maxval, isOrthoAxis) {
        this.bounds.bmax[axis] = maxval;
        this.bounds.bmin[axis] = minval;

        if (isOrthoAxis) {
          const thicknessPct = maxval - minval;
          this.setUniform('orthoThickness', thicknessPct);
        }
      
        this.setUniform('AABB_CLIP_MIN', this.bounds.bmin);
        this.setUniform('AABB_CLIP_MAX', this.bounds.bmax);
    }

    setChannelAsMask(channelIndex) {
        if (!this.volume.channels[channelIndex] || !this.volume.channels[channelIndex].loaded) {
          return false;
        }
        return this.channelData.setChannelAsMask(channelIndex, this.volume.channels[channelIndex]);
    }

    setMaskAlpha(maskAlpha) {
        this.setUniform('maskAlpha', maskAlpha);
    }
      
    setOrthoThickness(value) {
        this.setUniform('orthoThickness', value);
    }
          
    //////////////////////////////////////////
    //////////////////////////////////////////

    setUniform(name, value) {
        if (!this.uniforms[name]) {
          return;
        }
        this.uniforms[name].value = value;
        this.cubeMesh.material.needsUpdate = true;
    }
    
    // channelcolors is array of {rgbColor, lut} and channeldata is volume.channels
    fuse(channelcolors, channeldata) {
        //'m' for max or 'a' for avg
        var fusionType = 'm';
        this.channelData.fuse(channelcolors, fusionType, channeldata);

        // update to fused texture
        this.setUniform('textureAtlas', this.channelData.fusedTexture);
        this.setUniform('textureAtlasMask', this.channelData.maskTexture);
    }
};
