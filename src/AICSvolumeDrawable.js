import AICSchannelData from './AICSchannelData.js';
import FileSaver from './FileSaver.js';
import { getColorByChannelIndex } from './constants/colors.js';
import { defaultMaterialSettings } from './constants/materials.js';

import './MarchingCubes.js';
import NaiveSurfaceNets from './NaiveSurfaceNets.js';
import './STLBinaryExporter.js';

import 'three/examples/js/exporters/GLTFExporter.js';

function AICSvolumeDrawable(imageInfo) {
  this.imageInfo = imageInfo;
  this.name = imageInfo.name;

  // clean up some possibly bad data.
  this.imageInfo.pixel_size_x = imageInfo.pixel_size_x || 1.0;
  this.imageInfo.pixel_size_y = imageInfo.pixel_size_y || 1.0;
  this.imageInfo.pixel_size_z = imageInfo.pixel_size_z || 1.0;

  this.pixel_size = [
    this.imageInfo.pixel_size_x,
    this.imageInfo.pixel_size_y,
    this.imageInfo.pixel_size_z
  ];
  this.x = imageInfo.tile_width;
  this.y = imageInfo.tile_height;
  this.z = imageInfo.tiles;
  this.t = 1;


  this.num_channels = imageInfo.channels;
  
  this.channel_names = this.imageInfo.channel_names.slice();
  this.channel_colors_default = imageInfo.channel_colors ? imageInfo.channel_colors.slice() : this.channel_names.map((name, index) => getColorByChannelIndex(index));
  this.channel_colors = this.channel_colors_default.slice();

  this.fusion = this.channel_colors.map((col, index) => {
    let rgbColor;
    // take copy of original channel color
    if (col[0] === 0 && col[1] === 0 && col[2] === 0) {
      rgbColor = 0;
    } else {
      rgbColor = [col[0], col[1], col[2]];
    }
    return {
      chIndex: index,
      lut:[],
      rgbColor: rgbColor
    };
  });

  this.sceneRoot = new THREE.Object3D();//create an empty container

  this.cube = new THREE.BoxGeometry(1.0, 1.0, 1.0);
  this.cubeMesh = new THREE.Mesh(this.cube);
  this.cubeMesh.name = "Volume";

  this.meshRoot = new THREE.Object3D();//create an empty container
  this.meshRoot.name = "Mesh Surface Container";

  // draw meshes first, and volume last, for blending and depth test reasons
  this.sceneRoot.add(this.meshRoot);
  this.sceneRoot.add(this.cubeMesh);

  this.meshrep = [];

  this.bounds = {
    bmin: new THREE.Vector3(-0.5, -0.5, -0.5),
    bmax: new THREE.Vector3(0.5, 0.5, 0.5)
  };

  this.channelData = new AICSchannelData({
    count: this.num_channels,
    atlasSize:[this.imageInfo.atlas_width, this.imageInfo.atlas_height],
    volumeSize:[this.imageInfo.tile_width, this.imageInfo.tile_height, this.z],
    channelNames:this.channel_names
  }, this.redraw);

  this.uniforms = {
    'iResolution': {
      type:'v2',
      value: new THREE.Vector2(100, 100)
    },
    'CLIP_NEAR': {
      type:'f',
      value: 0.0
    },
    'CLIP_FAR': {
      type:'f',
      value: 10000.0
    },
    'maskAlpha': {
      type:'f',
      value: 1.0
    },
    'BRIGHTNESS': {
      type:'f',
      value: 0.0
    },
    'DENSITY': {
      type:'f',
      value: 0.0
    },
    'GAMMA_MIN': {
      type:'f',
      value: 0.0
    },
    'GAMMA_MAX': {
      type:'f',
      value: 1.0
    },
    'GAMMA_SCALE': {
      type:'f',
      value: 1.0
    },
    'BREAK_STEPS': {
      type: 'i',
      value: 128
    },
    'ATLAS_X': {
      type: 'f',
      value: 6
    },
    'ATLAS_Y': {
      type: 'f',
      value: 6
    },
    'SLICES': {
      type: 'f',
      value: 50
    },
    'isOrtho': {
      type: 'f',
      value: 0.0
    },
    'orthoThickness': {
      type: 'f',
      value: 1.0
    },
    'orthoScale': {
      type: 'f',
      value: 0.5  // needs to come from AICSthreeJsPanel's setting
    },
    'AABB_CLIP_MIN': {
      type: 'v3',
      value: new THREE.Vector3(-0.5, -0.5, -0.5)
    },
    'AABB_CLIP_MAX': {
      type: 'v3',
      value: new THREE.Vector3(0.5, 0.5, 0.5)
    },
    'inverseModelViewMatrix': {
      type: 'm4',
      value: new THREE.Matrix4()
    },
    'textureAtlas': {
      type: 't',
      value: null
    },
    'textureAtlasMask': {
      type: 't',
      value: null
    },
    'maxProject': {
      type: 'i',
      value: 0
    }
  };

  // shader,vtx and frag.
  var vtxsrc = [
    // switch on high precision floats
    "#ifdef GL_ES",
    "precision highp float;",
    "#endif",
    "varying vec3 pObj;",
    "void main()",
    "{",
    "  pObj = position;",
    "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);",
    "}"
  ].join('\n');
  var fgmtsrc = [
    '#ifdef GL_ES',
    'precision highp float;',
    '#endif',

    '#define M_PI 3.14159265358979323846',

    'uniform vec2 iResolution;',
    'uniform float GAMMA_MIN;',
    'uniform float GAMMA_MAX;',
    'uniform float GAMMA_SCALE;',
    'uniform float BRIGHTNESS;',
    'uniform float DENSITY;',
    'uniform float maskAlpha;',
    'uniform sampler2D textureAtlas;',
    'uniform sampler2D textureAtlasMask;',
    'uniform int BREAK_STEPS;',
    'uniform float ATLAS_X;',
    'uniform float ATLAS_Y;',
    'uniform float SLICES;',
    'uniform vec3 AABB_CLIP_MIN;',
    'uniform float CLIP_NEAR;',
    'uniform vec3 AABB_CLIP_MAX;',
    'uniform float CLIP_FAR;',
    'uniform float isOrtho;',
    'uniform float orthoThickness;',
    'uniform float orthoScale;',
    'uniform int maxProject;',

    // view space to axis-aligned volume box
    'uniform mat4 inverseModelViewMatrix;',

    ' varying vec3 pObj;',

    'float powf(float a, float b){',
    '  return pow(a,b);',
    '}',

    'float rand(vec2 co){',
    '  float threadId = gl_FragCoord.x/(gl_FragCoord.y + 1.0);',
    '  float bigVal = threadId*1299721.0/911.0;',
    '  vec2 smallVal = vec2(threadId*7927.0/577.0, threadId*104743.0/1039.0);',
    '  return fract(sin(dot(co ,smallVal)) * bigVal);',
    '}',

    'vec4 luma2Alpha(vec4 color, float vmin, float vmax, float C){',
    '  float x = max(color[2], max(color[0],color[1]));',
    '  float xi = (x-vmin)/(vmax-vmin);',
    '  xi = clamp(xi,0.0,1.0);',
    '  float y = pow(xi,C);',
    '  y = clamp(y,0.0,1.0);',
    '  color[3] = y;',
    '  return(color);',
    '}',

    'vec2 offsetFrontBack(float t, float nx, float ny){',
    '  int a = int(t);',
    '  int ax = int(ATLAS_X);',
    '  vec2 os = vec2(float(a-(a/ax)*ax) / ATLAS_X, float(a/ax) / ATLAS_Y);',
    '  return os;',
    '}',

    'vec4 sampleAs3DTexture(sampler2D tex, vec4 pos) {',
    '  float bounds = float(pos[0] >= 0.0 && pos[0] <= 1.0 &&',
    '                       pos[1] >= 0.0 && pos[1] <= 1.0 &&',
    '                       pos[2] >= 0.0 && pos[2] <= 1.0 );',
    '  float nSlices = float(SLICES);',
    // get location within atlas tile
    // TODO: get loc1 which follows ray to next slice along ray direction
    '  vec2 loc0 = vec2((pos.x)/ATLAS_X,(1.0 - pos.y)/ATLAS_Y);',

    // interpolate between two slices

    // this 0.0001 fudge factor fixes a bug when the volume is clipped to a single slice boundary.
    // Basically I am pushing the number just slightly off of an integer multiple.
    '  float z = (pos.z)*(nSlices + 0.0001);',
    '  float zfloor = floor(z);',
    '  float z0  = zfloor;',
    '  float z1 = (zfloor+1.0);',
    '  z1 = clamp(z1, 0.0, nSlices);',
    // get slice offsets in texture atlas
    '  vec2 o0 = offsetFrontBack(z0,ATLAS_X,ATLAS_Y);//*pix;',
    '  vec2 o1 = offsetFrontBack(z1,ATLAS_X,ATLAS_Y);//*pix;',
    '  o0 = clamp(o0, 0.0, 1.0) + loc0;',
    '  o1 = clamp(o1, 0.0, 1.0) + loc0;',

    '  float t = z-zfloor;', //mod(z, 1.0);',
    '  vec4 slice0Color = texture2D(tex, o0);',
    '  vec4 slice1Color = texture2D(tex, o1);',
    '  float slice0Mask = texture2D(textureAtlasMask, o0).x;',
    '  float slice1Mask = texture2D(textureAtlasMask, o1).x;',
    '  float maskVal = mix(slice0Mask, slice1Mask, t);',
    // take mask from 0..1 to alpha..1
    '  maskVal = mix(maskVal, 1.0, maskAlpha);',
    '  vec4 retval = mix(slice0Color, slice1Color, t);',
    // only mask the rgb, not the alpha(?)
    '  retval.rgb *= maskVal;',
    '  return bounds*retval;',
    '}',

    'vec4 sampleStack(sampler2D tex, vec4 pos) {',
    '  vec4 col = sampleAs3DTexture(tex, pos);',
    '  col = luma2Alpha(col, GAMMA_MIN, GAMMA_MAX, GAMMA_SCALE);',
    'return col;',
    '}',

    'bool intersectBox(in vec3 r_o, in vec3 r_d, in vec3 boxMin, in vec3 boxMax,',
    '                  out float tnear, out float tfar){',
    // compute intersection of ray with all six bbox planes
    '  vec3 invR = vec3(1.0,1.0,1.0) / r_d;',
    '  vec3 tbot = invR * (boxMin - r_o);',
    '  vec3 ttop = invR * (boxMax - r_o);',

    // re-order intersections to find smallest and largest on each axis
    '  vec3 tmin = min(ttop, tbot);',
    '  vec3 tmax = max(ttop, tbot);',

    // find the largest tmin and the smallest tmax
    '  float largest_tmin  = max(max(tmin.x, tmin.y), max(tmin.x, tmin.z));',
    '  float smallest_tmax = min(min(tmax.x, tmax.y), min(tmax.x, tmax.z));',

    '  tnear = largest_tmin;',
    '  tfar = smallest_tmax;',

    // use >= here?
    '  return(smallest_tmax > largest_tmin);',
    '}',

    'vec4 accumulate(vec4 col, float s, vec4 C) {',
    '    float stepScale = (1.0 - powf((1.0-col.w),s));',
    '    col.w = stepScale;',
    '    col.xyz *= col.w;',
    '    col = clamp(col,0.0,1.0);',

    '    C = (1.0-C.w)*col + C;',
    '    return C;',
    '}',

    'vec4 accumulateMax(vec4 col, float s, vec4 C) {',
    '    if (col.x*col.w > C.x) { C.x = col.x*col.w; }',
    '    if (col.y*col.w > C.y) { C.y = col.y*col.w; }',
    '    if (col.z*col.w > C.z) { C.z = col.z*col.w; }',
    '    if (col.w > C.w) { C.w = col.w; }',
    '    return C;',
    '}',
    
    'vec4 integrateVolume(vec4 eye_o,vec4 eye_d,',
    '                     float tnear,   float tfar,',
    '                     float clipNear, float clipFar,',
    '                     sampler2D textureAtlas',
    '                     ){',
    ' vec4 C = vec4(0.0);',
    ' float tend   = tfar;',
    ' float tbegin = tnear;',

    //'  // march along ray from front to back, accumulating color',

    //'  //estimate step length',
    '  const int maxSteps = ##MAXSTEPS##;',
    '  float csteps = clamp(float(BREAK_STEPS), 1.0, float(maxSteps));',
    '  float invstep = 1.0/csteps;',
    // special-casing the single slice to remove the random ray dither.
    // this removes a Moire pattern visible in single slice images, which we want to view as 2D images as best we can.
    '  float r = (SLICES==1.0) ?  0.0 : 0.5 - 1.0*rand(eye_d.xy);',
    // if ortho and clipped, make step size smaller so we still get same number of steps
    '  float tstep = invstep*orthoThickness;',
    '  float tfarsurf = r*tstep;',
    '  float overflow = mod((tfarsurf - tend),tstep);', // random dithering offset
    '  float t = tbegin + overflow;',
    '  t += r*tstep;', // random dithering offset
    '  float tdist = 0.0;',
    '  int numSteps = 0;',
    'vec4 pos, col;',
    // We need to be able to scale the alpha contrib with number of ray steps,
    // in order to make the final color invariant to the step size(?)
    // use maxSteps (a constant) as the numerator... Not sure if this is sound.
    '    float s = 0.5 * float(maxSteps) / csteps;',
    'for(int i=0; i<maxSteps; i++){',
    '  pos = eye_o + eye_d*t;',
    // !!! assume box bounds are -0.5 .. 0.5.  pos = (pos-min)/(max-min)
    // scaling is handled by model transform and already accounted for before we get here.
    // AABB clip is independent of this and is only used to determine tnear and tfar.
    '  pos.xyz = (pos.xyz-(-0.5))/((0.5)-(-0.5)); //0.5 * (pos + 1.0); // map position from [boxMin, boxMax] to [0, 1] coordinates',
    '  col = sampleStack(textureAtlas,pos);',

    '      col.xyz *= BRIGHTNESS;',

    '    if (maxProject != 0) {',
    '      C = accumulateMax(col, s, C);',
    '    } else {',
    // for practical use the density only matters for regular volume integration
    '      col.w *= DENSITY;',
    '      C = accumulate(col, s, C);',
    '    }',
    '    t += tstep;',
    '    numSteps = i;',

    '    if (t  > tend || t > tbegin+clipFar ) break;',
    '    if (C.w > 1.0 ) break;',
    '}',

    '  return C;',
    '}',
    'void main()',
    '{',
    '  gl_FragColor = vec4(0.0);',
    '  vec2 vUv = gl_FragCoord.xy/iResolution.xy;',

    '  vec3 eyeRay_o, eyeRay_d;',

    '  if (isOrtho == 0.0) {',
    // for perspective rays:
    // world space camera coordinates
    // transform to object space
    '    eyeRay_o = (inverseModelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;',
    '    eyeRay_d = normalize(pObj - eyeRay_o);',
    '  }',
    '  else {',
    // for ortho rays:
    '    float zDist = 2.0;',
    '    eyeRay_d = (inverseModelViewMatrix*vec4(0.0, 0.0, -zDist, 0.0)).xyz;',
    '    vec4 ray_o = vec4(2.0*vUv - 1.0, 1.0, 1.0);',
    '    ray_o.xy *= orthoScale;',
    '    ray_o.x *= iResolution.x/iResolution.y;',
    '    eyeRay_o   = (inverseModelViewMatrix*ray_o).xyz;',
    '  }',

    // -0.5..0.5 is full box. AABB_CLIP lets us clip to a box shaped ROI to look at
    // I am applying it here at the earliest point so that the ray march does
    // not waste steps.  For general shaped ROI, this has to be handled more
    // generally (obviously)
    '  vec3 boxMin = AABB_CLIP_MIN;',
    '  vec3 boxMax = AABB_CLIP_MAX;',

    '  float tnear, tfar;',
    '  bool hit = intersectBox(eyeRay_o, eyeRay_d, boxMin, boxMax, tnear, tfar);',

    '  if (!hit) {',
    // return background color if ray misses the cube
    // is this safe to do when there is other geometry / gObjects drawn?
    '     gl_FragColor = vec4(0.0);', //C1;//vec4(0.0);',
    '     return;',
    '  }',

    '  float clipNear = 0.0;//-(dot(eyeRay_o.xyz, eyeNorm) + dNear) / dot(eyeRay_d.xyz, eyeNorm);',
    '  float clipFar  = 10000.0;//-(dot(eyeRay_o.xyz,-eyeNorm) + dFar ) / dot(eyeRay_d.xyz,-eyeNorm);',

    '  vec4 C = integrateVolume(vec4(eyeRay_o,1.0), vec4(eyeRay_d,0.0),',
    '                           tnear,    tfar,', //intersections of box
    '                           clipNear, clipFar,',
    '                           textureAtlas);//,nBlocks);',
    '  C = clamp(C, 0.0, 1.0);',
    '  gl_FragColor = C;',
    '  return;',

    '}'

  ].join('\n');

  fgmtsrc = fgmtsrc.replace(/##MAXSTEPS##/g, '' + 512);

  var threeMaterial = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: vtxsrc,
    fragmentShader: fgmtsrc,
    transparent: true,
    depthTest: false
  });
  this.cubeMesh.material = threeMaterial;


  this.setUniform("ATLAS_X", this.imageInfo.cols);
  this.setUniform("ATLAS_Y", this.imageInfo.rows);
  this.setUniform("SLICES", this.z);

  this.setVoxelSize(this.pixel_size);

  var cx = 0.0;
  var cz = 0.0;
  var cy = 0.0;
  this.sceneRoot.position.set(cx,cy,cz);
  this.maxSteps = 256;

}

AICSvolumeDrawable.prototype.resetSampleRate = function() {
  this.steps = this.maxSteps / 2;
};

AICSvolumeDrawable.prototype.setMaxSampleRate = function(qual) {
  this.maxSteps = qual;
  this.setUniform('maxSteps', qual);
};

AICSvolumeDrawable.prototype.setScale = function(scale) {

  this.scale = scale;

  this.currentScale = scale.clone();

  this.meshRoot.scale.copy(new THREE.Vector3(0.5 * scale.x,
    0.5 * scale.y,
    0.5 * scale.z));

  this.cubeMesh.scale.copy(new THREE.Vector3(scale.x,
    scale.y,
    scale.z));


  this.cubeMesh.updateMatrixWorld(true);
  var mi = new THREE.Matrix4();
  mi.getInverse(this.cubeMesh.matrixWorld);
  this.setUniformNoRerender('inverseModelViewMatrix', mi, true, true);
};

AICSvolumeDrawable.prototype.setUniform = function(name, value) {
  this.setUniformNoRerender(name, value);
};

AICSvolumeDrawable.prototype.setUniformNoRerender = function(name, value) {
  if (!this.uniforms[name]) {
    return;
  }
  this.uniforms[name].value = value;
  //this.uniforms[name].needsUpdate = true;
  //this.cubeMesh.material.uniforms[name].value = value;
  this.cubeMesh.material.needsUpdate = true;
};

AICSvolumeDrawable.prototype.initResolution = function(canvas) {
  var res = new THREE.Vector2(canvas.getWidth(), canvas.getHeight());
  this.initUniform('iResolution', "v2", res);
};

AICSvolumeDrawable.prototype.setResolution = function(viewObj) {
  var res = new THREE.Vector2(viewObj.getWidth(), viewObj.getHeight());
  this.setUniform('iResolution', res);
};

// TODO handle this differently in 3D mode vs 2D mode?
AICSvolumeDrawable.prototype.setAxisClip = function(axis, minval, maxval, isOrthoAxis) {
  this.bounds.bmax[axis] = maxval;
  this.bounds.bmin[axis] = minval;

  if (isOrthoAxis) {
    const thicknessPct = maxval - minval;
    this.setUniformNoRerender('orthoThickness', thicknessPct);
  }

  this.setUniformNoRerender('AABB_CLIP_MIN', this.bounds.bmin);
  this.setUniform('AABB_CLIP_MAX', this.bounds.bmax);
};

AICSvolumeDrawable.prototype.setOrthoThickness = function(value) {
  this.setUniformNoRerender('orthoThickness', value);
};

AICSvolumeDrawable.prototype.onAnimate = function(canvas) {
  this.cubeMesh.updateMatrixWorld(true);

  // TODO: this is inefficient, as this work is duplicated by threejs.
  canvas.camera.updateMatrixWorld(true);
  canvas.camera.matrixWorldInverse.getInverse( canvas.camera.matrixWorld );

  var mvm = new THREE.Matrix4();
  mvm.multiplyMatrices(canvas.camera.matrixWorldInverse, this.cubeMesh.matrixWorld);
  var mi = new THREE.Matrix4();
  mi.getInverse(mvm);

  this.setUniform('inverseModelViewMatrix', mi, true, true);
};

AICSvolumeDrawable.prototype.updateMeshColors = function() {
  for (var i = 0; i < this.num_channels; ++i) {
    if (this.meshrep[i]) {
      var rgb = this.channel_colors[i];
      var c = [rgb[0]/255.0, rgb[1]/255.0, rgb[2]/255.0];

      this.meshrep[i].traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.color = c;
        }
      });
      if (this.meshrep[i].material) {
        this.meshrep[i].material.color = c;
      }
    }
  }
};

AICSvolumeDrawable.prototype.createMaterialForChannel = function(channelIndex, alpha, transp) {
  let rgb = this.channel_colors[channelIndex];
  const col = (rgb[0] << 16) | (rgb[1] << 8) | (rgb[2]);
  const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(col),
    shininess: defaultMaterialSettings.shininess,
    specular: new THREE.Color(defaultMaterialSettings.specularColor),
    opacity: alpha,
    transparent: (alpha < 0.9)
  });
  return material;
};

AICSvolumeDrawable.prototype.generateIsosurfaceGeometry = function(channelIndex, isovalue) {
  if (!this.channelData) {
    return [];
  }
  const volumedata = this.channelData.channels[channelIndex].volumeData;

  const marchingcubes = true;

  if (marchingcubes) {
    let effect = new THREE.MarchingCubes(
      [this.imageInfo.tile_width, this.imageInfo.tile_height, this.z],
      null,
      false, false, true,
      volumedata
    );
    effect.position.set( 0, 0, 0 );
    effect.scale.set( 0.5 * this.scale.x, 0.5 * this.scale.y, 0.5 * this.scale.z );
    effect.isovalue = isovalue;
    var geometries = effect.generateGeometry();
    // TODO: weld vertices and recompute normals.  MarchingCubes results in excessive coincident verts
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
      [this.imageInfo.tile_width, this.imageInfo.tile_height, this.z],
      isovalue
    );
    return NaiveSurfaceNets.constructTHREEGeometry(result);
  }

};


AICSvolumeDrawable.prototype.createMeshForChannel = function(channelIndex, isovalue, alpha, transp) {
  const geometries = this.generateIsosurfaceGeometry(channelIndex, isovalue);
  const material = this.createMaterialForChannel(channelIndex, alpha, transp);

  let theObject = new THREE.Object3D();
  theObject.name = "Channel"+channelIndex;
  theObject.userData = {isovalue:isovalue};
  // proper scaling will be done in parent object
  for (var i = 0; i < geometries.length; ++i) {
    let mesh = new THREE.Mesh( geometries[i], material );
    theObject.add(mesh);
  }
  return theObject;
};

AICSvolumeDrawable.prototype.updateIsovalue = function(channel, value, opacity) {
  if (!this.meshrep[channel]) {
    return;
  }

  this.destroyIsosurface(channel);

  this.meshrep[channel] = this.createMeshForChannel(channel, value, opacity, false);

  this.meshRoot.add(this.meshrep[channel]);
};

AICSvolumeDrawable.prototype.getIsovalue = function(channel) {
  if (!this.meshrep[channel]) {
    return undefined;
  }
  return this.meshrep[channel].userData.isovalue;
};

AICSvolumeDrawable.prototype.updateOpacity = function(channel, value) {
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
};

AICSvolumeDrawable.prototype.hasIsosurface = function(channel) {
  return (!!this.meshrep[channel]);
};

AICSvolumeDrawable.prototype.createIsosurface = function(channel, value, alpha, transp) {
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
};

AICSvolumeDrawable.prototype.destroyIsosurface = function(channel) {
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
};

AICSvolumeDrawable.prototype.fuse = function() {
  if (!this.channelData) {
    return;
  }
  //if (!this.channelData.loaded) {
  //	return;
  //}

  //'m' for max or 'a' for avg
  var fusionType = 'm';
  this.channelData.fuse(this.fusion, fusionType);

  // update to fused texture
  this.setUniform('textureAtlas', this.channelData.fusedTexture);
  this.setUniform('textureAtlasMask', this.channelData.maskTexture);

  if (this.redraw) {
    this.redraw();
  }

};

AICSvolumeDrawable.prototype.setVoxelSize = function(values) {
  // basic error check.  bail out if we get something bad.
  if (!values.length || values.length < 3) {
    return;
  }

  // only set the data if it is > 0.  zero is not an allowed value.
  if (values[0] > 0) {
    this.pixel_size[0] = values[0];
  }
  if (values[1] > 0) {
    this.pixel_size[1] = values[1];
  }
  if (values[2] > 0) {
    this.pixel_size[2] = values[2];
  }

  var physSizeMin = Math.min(this.pixel_size[0], Math.min(this.pixel_size[1], this.pixel_size[2]));
  var pixelsMax = Math.max(this.imageInfo.width, Math.max(this.imageInfo.height,this.z));
  var sx = this.pixel_size[0]/physSizeMin * this.imageInfo.width/pixelsMax;
  var sy = this.pixel_size[1]/physSizeMin * this.imageInfo.height/pixelsMax;
  var sz = this.pixel_size[2]/physSizeMin * this.z/pixelsMax;

  this.setScale(new THREE.Vector3(sx,sy,sz));

};

AICSvolumeDrawable.prototype.cleanup = function() {
  for (var i = 0; i < this.num_channels; ++i) {
    this.destroyIsosurface(i);
  }

  this.cube.dispose();
  this.cubeMesh.material.dispose();

  this.channelData.cleanup();
  this.channelData.fusedTexture.dispose();
  this.channelData.maskTexture.dispose();
};

AICSvolumeDrawable.prototype.channelNames = function() {
  return this.imageInfo.channel_names;
};

AICSvolumeDrawable.prototype.getChannel = function(channelIndex) {
  return this.channelData.channels[channelIndex];
};

AICSvolumeDrawable.prototype.setChannelCallbacks = function(allChannelsLoadedCb, channelLoadedCb) {
  // fires allChannelsLoadedCb when all channel data is done.
  // fires channelLoadedCb when each channel is done
  this.channelData.setCallbacks(allChannelsLoadedCb, channelLoadedCb);
};

AICSvolumeDrawable.prototype.saveChannelIsosurface = function(channelIndex, type) {
  if (!this.meshrep[channelIndex]) {
    return;
  }

  if (type === "STL") {
    this.exportSTL(this.meshrep[channelIndex], this.name+"_"+this.channel_names[channelIndex]);
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
    this.exportGLTF(this.meshRoot, this.name+"_"+this.channel_names[channelIndex]);
    for (var i = 0; i < this.meshrep.length; ++i) {
      if (this.meshrep[i]) {
        this.meshrep[i].visible = prevviz[i];
      }
    }
  }
};

AICSvolumeDrawable.prototype.exportSTL = function( input, fname ) {
  var ex = new THREE.STLBinaryExporter();
  var output = ex.parse(input);
  FileSaver.saveBinary(output.buffer, fname+'.stl');
};

// takes a scene or object or array of scenes or objects or both!
AICSvolumeDrawable.prototype.exportGLTF = function( input, fname ) {
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
};


AICSvolumeDrawable.prototype.setVolumeChannelEnabled = function(channelIndex, enabled) {
  // flip the color to the "null" value
  this.fusion[channelIndex].rgbColor = enabled ? this.channel_colors[channelIndex] : 0;
  // if all are nulled out, then hide the volume element from the scene.
  if (this.fusion.every((elem)=>(elem.rgbColor === 0))) {
    this.cubeMesh.visible = false;
  }
  else {
    this.cubeMesh.visible = true;
  }
};

AICSvolumeDrawable.prototype.updateChannelColor = function(channelIndex, colorrgba) {
  if (!this.channel_colors[channelIndex]) {
    return;
  }
  this.channel_colors[channelIndex] = colorrgba;
  // if volume channel is zero'ed out, then don't update it until it is switched on again.
  if (this.fusion[channelIndex].rgbColor !== 0) {
    this.fusion[channelIndex].rgbColor = colorrgba;
    this.fuse();
  }
  this.updateMeshColors();
};

AICSvolumeDrawable.prototype.setDensity = function(density, no_redraw) {
  if (no_redraw) {
    this.setUniformNoRerender("DENSITY", density);
  }
  else {
    this.setUniform("DENSITY", density);
  }
};
AICSvolumeDrawable.prototype.setBrightness = function(brightness, no_redraw) {
  if (no_redraw) {
    this.setUniformNoRerender("BRIGHTNESS", brightness);
  }
  else {
    this.setUniform("BRIGHTNESS", brightness);
  }
};

// ASSUMES that this.channelData.options is already set and incoming data is consistent with it
AICSvolumeDrawable.prototype.setChannelDataFromAtlas = function(channelIndex, atlasdata, atlaswidth, atlasheight) {
  this.channelData.channels[channelIndex].setBits(atlasdata, atlaswidth, atlasheight);
  this.channelData.channels[channelIndex].unpackVolume(this.channelData.options);  
  this.channelData.onChannelLoaded.call(this.channelData, [channelIndex]);
};

// ASSUMES that this.channelData.options is already set and incoming data is consistent with it
AICSvolumeDrawable.prototype.setChannelDataFromVolume = function(channelIndex, volumeData) {
  this.channelData.channels[channelIndex].setFromVolumeData(volumeData, this.channelData.options);
  this.channelData.onChannelLoaded.call(this.channelData, [channelIndex]);
};

export default AICSvolumeDrawable;
