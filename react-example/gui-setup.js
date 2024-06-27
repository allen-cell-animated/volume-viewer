import { Vector3 } from "three";
import { Light, SKY_LIGHT, AREA_LIGHT } from "../es";
import GUI from 'lil-gui';

export const myState = {
  file: "",
  volume: null,
  density: 12.5,
  maskAlpha: 1.0,
  exposure: 0.75,
  aperture: 0.0,
  fov: 20,
  focal_distance: 4.0,

  lights: [new Light(SKY_LIGHT), new Light(AREA_LIGHT)],

  skyTopIntensity: 0.3,
  skyMidIntensity: 0.3,
  skyBotIntensity: 0.3,
  skyTopColor: [255, 255, 255],
  skyMidColor: [255, 255, 255],
  skyBotColor: [255, 255, 255],

  lightColor: [255, 255, 255],
  lightIntensity: 75.0,
  lightTheta: 14, //deg
  lightPhi: 54, //deg

  xmin: 0.0,
  ymin: 0.0,
  zmin: 0.0,
  xmax: 1.0,
  ymax: 1.0,
  zmax: 1.0,

  samplingRate: 0.25,
  primaryRay: 1.0,
  secondaryRay: 1.0,

  isPT: false,

  isTurntable: false,
  isAxisShowing: false,
  isAligned: true,

  flipX: 1,
  flipY: 1,
  flipZ: 1,
};

export function showChannelUI(volume, view3D, gui) {
  if (myState && myState.channelFolderNames) {
    for (let i = 0; i < myState.channelFolderNames.length; ++i) {
      gui.removeFolder(myState.channelFolderNames[i]);
    }
  }

  myState.infoObj = volume.imageInfo;

  myState.infoObj.channelGui = [];

  myState.channelFolderNames = [];
  for (let i = 0; i < myState.infoObj.channels; ++i) {
    myState.infoObj.channelGui.push({
      colorD: volume.channelColorsDefault[i],
      colorS: [0, 0, 0],
      colorE: [0, 0, 0],
      window: 1.0,
      level: 0.5,
      glossiness: 0.0,
      isovalue: 128, // actual intensity value
      isosurface: false,
      // first 3 channels for starters
      enabled: i < 3,
      // this doesn't give good results currently but is an example of a per-channel button callback
      autoIJ: (function (j) {
        return function () {
          const [hmin, hmax] = volume.getHistogram(j).findAutoIJBins();
          const lut = new Lut().createFromMinMax(hmin, hmax);
          volume.setLut(j, lut);
          view3D.updateLuts(volume);
        };
      })(i),
      // this doesn't give good results currently but is an example of a per-channel button callback
      auto0: (function (j) {
        return function () {
          const [b, e] = volume.getHistogram(j).findAutoMinMax();
          const lut = new Lut().createFromMinMax(b, e);
          volume.setLut(j, lut);
          view3D.updateLuts(volume);
        };
      })(i),
      // this doesn't give good results currently but is an example of a per-channel button callback
      bestFit: (function (j) {
        return function () {
          const [hmin, hmax] = volume.getHistogram(j).findBestFitBins();
          const lut = new Lut().createFromMinMax(hmin, hmax);
          volume.setLut(j, lut);
          view3D.updateLuts(volume);
        };
      })(i),
      pct50_98: (function (j) {
        return function () {
          const hmin = volume.getHistogram(j).findBinOfPercentile(0.5);
          const hmax = volume.getHistogram(j).findBinOfPercentile(0.983);
          const lut = new Lut().createFromMinMax(hmin, hmax);
          volume.setLut(j, lut);
          view3D.updateLuts(volume);
        };
      })(i),
    });
    var channelGuiFolder = gui.addFolder("Channel " + myState.infoObj.channel_names[i]);
    myState.channelFolderNames.push("Channel " + myState.infoObj.channel_names[i]);
    channelGuiFolder.add(myState.infoObj.channelGui[i], "enabled").onChange(
      (function (j) {
        return function (value) {
          view3D.setVolumeChannelEnabled(volume, j, value ? true : false);
          view3D.updateActiveChannels(volume);
        };
      })(i)
    );
    channelGuiFolder.add(myState.infoObj.channelGui[i], "isosurface").onChange(
      (function (j) {
        return function (value) {
          if (value) {
            view3D.createIsosurface(volume, j, myState.infoObj.channelGui[j].isovalue, 1.0);
          } else {
            view3D.clearIsosurface(volume, j);
          }
        };
      })(i)
    );
    channelGuiFolder
      .add(myState.infoObj.channelGui[i], "isovalue")
      .max(255)
      .min(0)
      .step(1)
      .onChange(
        (function (j) {
          return function (value) {
            view3D.updateIsosurface(volume, j, value);
          };
        })(i)
      );

    channelGuiFolder
      .addColor(myState.infoObj.channelGui[i], "colorD", 255)
      .name("Diffuse")
      .onChange(
        (function (j) {
          return function (value) {
            view3D.updateChannelMaterial(
              volume,
              j,
              myState.infoObj.channelGui[j].colorD,
              myState.infoObj.channelGui[j].colorS,
              myState.infoObj.channelGui[j].colorE,
              myState.infoObj.channelGui[j].glossiness
            );
            view3D.updateMaterial(volume);
          };
        })(i)
      );
    channelGuiFolder
      .addColor(myState.infoObj.channelGui[i], "colorS", 255)
      .name("Specular")
      .onChange(
        (function (j) {
          return function (value) {
            view3D.updateChannelMaterial(
              volume,
              j,
              myState.infoObj.channelGui[j].colorD,
              myState.infoObj.channelGui[j].colorS,
              myState.infoObj.channelGui[j].colorE,
              myState.infoObj.channelGui[j].glossiness
            );
            view3D.updateMaterial(volume);
          };
        })(i)
      );
    channelGuiFolder
      .addColor(myState.infoObj.channelGui[i], "colorE", 255)
      .name("Emissive")
      .onChange(
        (function (j) {
          return function (value) {
            view3D.updateChannelMaterial(
              volume,
              j,
              myState.infoObj.channelGui[j].colorD,
              myState.infoObj.channelGui[j].colorS,
              myState.infoObj.channelGui[j].colorE,
              myState.infoObj.channelGui[j].glossiness
            );
            view3D.updateMaterial(volume);
          };
        })(i)
      );
    channelGuiFolder
      .add(myState.infoObj.channelGui[i], "window")
      .max(1.0)
      .min(0.0)
      .step(0.001)
      .onChange(
        (function (j) {
          return function (value) {
            const hwindow = value;
            const hlevel = myState.infoObj.channelGui[j].level;
            const lut = new Lut().createFromWindowLevel(hwindow, hlevel);
            volume.setLut(j, lut);
            view3D.updateLuts(volume);
          };
        })(i)
      );

    channelGuiFolder
      .add(myState.infoObj.channelGui[i], "level")
      .max(1.0)
      .min(0.0)
      .step(0.001)
      .onChange(
        (function (j) {
          return function (value) {
            const hwindow = myState.infoObj.channelGui[j].window;
            const hlevel = value;
            const lut = new Lut().createFromWindowLevel(hwindow, hlevel);
            volume.setLut(j, lut);
            view3D.updateLuts(volume);
          };
        })(i)
      );
    channelGuiFolder.add(myState.infoObj.channelGui[i], "autoIJ");
    channelGuiFolder.add(myState.infoObj.channelGui[i], "auto0");
    channelGuiFolder.add(myState.infoObj.channelGui[i], "bestFit");
    channelGuiFolder.add(myState.infoObj.channelGui[i], "pct50_98");
    channelGuiFolder
      .add(myState.infoObj.channelGui[i], "glossiness")
      .max(100.0)
      .min(0.0)
      .onChange(
        (function (j) {
          return function (value) {
            view3D.updateChannelMaterial(
              volume,
              j,
              myState.infoObj.channelGui[j].colorD,
              myState.infoObj.channelGui[j].colorS,
              myState.infoObj.channelGui[j].colorE,
              myState.infoObj.channelGui[j].glossiness
            );
            view3D.updateMaterial(volume);
          };
        })(i)
      );
  }
}

export function setupGui(view3D) {
  // eslint-disable-next-line no-undef
  let gui = new GUI();

  gui
    .add(myState, "density")
    .max(100.0)
    .min(0.0)
    .step(0.001)
    .onChange(function (value) {
      view3D.updateDensity(myState.volume, value / 50.0);
    });
  gui
    .add(myState, "maskAlpha")
    .max(1.0)
    .min(0.0)
    .step(0.001)
    .onChange(function (value) {
      view3D.updateMaskAlpha(myState.volume, value);
    });
  gui
    .add(myState, "primaryRay")
    .max(40.0)
    .min(1.0)
    .step(0.1)
    .onChange(function (value) {
      view3D.setRayStepSizes(myState.volume, myState.primaryRay, myState.secondaryRay);
    });
  gui
    .add(myState, "secondaryRay")
    .max(40.0)
    .min(1.0)
    .step(0.1)
    .onChange(function (value) {
      view3D.setRayStepSizes(myState.volume, myState.primaryRay, myState.secondaryRay);
    });

  var cameragui = gui.addFolder("Camera");
  cameragui
    .add(myState, "exposure")
    .max(1.0)
    .min(0.0)
    .step(0.001)
    .onChange(function (value) {
      view3D.updateExposure(value);
    });
  cameragui
    .add(myState, "aperture")
    .max(0.1)
    .min(0.0)
    .step(0.001)
    .onChange(function (value) {
      view3D.updateCamera(myState.fov, myState.focal_distance, myState.aperture);
    });
  cameragui
    .add(myState, "focal_distance")
    .max(5.0)
    .min(0.1)
    .step(0.001)
    .onChange(function (value) {
      view3D.updateCamera(myState.fov, myState.focal_distance, myState.aperture);
    });
  cameragui
    .add(myState, "fov")
    .max(90.0)
    .min(0.0)
    .step(0.001)
    .onChange(function (value) {
      view3D.updateCamera(myState.fov, myState.focal_distance, myState.aperture);
    });
  cameragui
    .add(myState, "samplingRate")
    .max(1.0)
    .min(0.1)
    .step(0.001)
    .onChange(function (value) {
      view3D.updatePixelSamplingRate(value);
    });

  var clipping = gui.addFolder("Clipping Box");
  clipping
    .add(myState, "xmin")
    .max(1.0)
    .min(0.0)
    .step(0.001)
    .onChange(function (value) {
      view3D.updateClipRegion(
        myState.volume,
        myState.xmin,
        myState.xmax,
        myState.ymin,
        myState.ymax,
        myState.zmin,
        myState.zmax
      );
    });
  clipping
    .add(myState, "xmax")
    .max(1.0)
    .min(0.0)
    .step(0.001)
    .onChange(function (value) {
      view3D.updateClipRegion(
        myState.volume,
        myState.xmin,
        myState.xmax,
        myState.ymin,
        myState.ymax,
        myState.zmin,
        myState.zmax
      );
    });
  clipping
    .add(myState, "ymin")
    .max(1.0)
    .min(0.0)
    .step(0.001)
    .onChange(function (value) {
      view3D.updateClipRegion(
        myState.volume,
        myState.xmin,
        myState.xmax,
        myState.ymin,
        myState.ymax,
        myState.zmin,
        myState.zmax
      );
    });
  clipping
    .add(myState, "ymax")
    .max(1.0)
    .min(0.0)
    .step(0.001)
    .onChange(function (value) {
      view3D.updateClipRegion(
        myState.volume,
        myState.xmin,
        myState.xmax,
        myState.ymin,
        myState.ymax,
        myState.zmin,
        myState.zmax
      );
    });
  clipping
    .add(myState, "zmin")
    .max(1.0)
    .min(0.0)
    .step(0.001)
    .onChange(function (value) {
      view3D.updateClipRegion(
        myState.volume,
        myState.xmin,
        myState.xmax,
        myState.ymin,
        myState.ymax,
        myState.zmin,
        myState.zmax
      );
    });
  clipping
    .add(myState, "zmax")
    .max(1.0)
    .min(0.0)
    .step(0.001)
    .onChange(function (value) {
      view3D.updateClipRegion(
        myState.volume,
        myState.xmin,
        myState.xmax,
        myState.ymin,
        myState.ymax,
        myState.zmin,
        myState.zmax
      );
    });

  var lighting = gui.addFolder("Lighting");
  lighting
    .addColor(myState, "skyTopColor", 255)
    .name("Sky Top")
    .onChange(function (value) {
      myState.lights[0].mColorTop = new Vector3(
        (myState.skyTopColor[0] / 255.0) * myState.skyTopIntensity,
        (myState.skyTopColor[1] / 255.0) * myState.skyTopIntensity,
        (myState.skyTopColor[2] / 255.0) * myState.skyTopIntensity
      );
      view3D.updateLights(myState.lights);
    });
  lighting
    .add(myState, "skyTopIntensity")
    .max(100.0)
    .min(0.01)
    .step(0.1)
    .onChange(function (value) {
      myState.lights[0].mColorTop = new Vector3(
        (myState.skyTopColor[0] / 255.0) * myState.skyTopIntensity,
        (myState.skyTopColor[1] / 255.0) * myState.skyTopIntensity,
        (myState.skyTopColor[2] / 255.0) * myState.skyTopIntensity
      );
      view3D.updateLights(myState.lights);
    });
  lighting
    .addColor(myState, "skyMidColor", 255)
    .name("Sky Mid")
    .onChange(function (value) {
      myState.lights[0].mColorMiddle = new Vector3(
        (myState.skyMidColor[0] / 255.0) * myState.skyMidIntensity,
        (myState.skyMidColor[1] / 255.0) * myState.skyMidIntensity,
        (myState.skyMidColor[2] / 255.0) * myState.skyMidIntensity
      );
      view3D.updateLights(myState.lights);
    });
  lighting
    .add(myState, "skyMidIntensity")
    .max(100.0)
    .min(0.01)
    .step(0.1)
    .onChange(function (value) {
      myState.lights[0].mColorMiddle = new Vector3(
        (myState.skyMidColor[0] / 255.0) * myState.skyMidIntensity,
        (myState.skyMidColor[1] / 255.0) * myState.skyMidIntensity,
        (myState.skyMidColor[2] / 255.0) * myState.skyMidIntensity
      );
      view3D.updateLights(myState.lights);
    });
  lighting
    .addColor(myState, "skyBotColor", 255)
    .name("Sky Bottom")
    .onChange(function (value) {
      myState.lights[0].mColorBottom = new Vector3(
        (myState.skyBotColor[0] / 255.0) * myState.skyBotIntensity,
        (myState.skyBotColor[1] / 255.0) * myState.skyBotIntensity,
        (myState.skyBotColor[2] / 255.0) * myState.skyBotIntensity
      );
      view3D.updateLights(myState.lights);
    });
  lighting
    .add(myState, "skyBotIntensity")
    .max(100.0)
    .min(0.01)
    .step(0.1)
    .onChange(function (value) {
      myState.lights[0].mColorBottom = new Vector3(
        (myState.skyBotColor[0] / 255.0) * myState.skyBotIntensity,
        (myState.skyBotColor[1] / 255.0) * myState.skyBotIntensity,
        (myState.skyBotColor[2] / 255.0) * myState.skyBotIntensity
      );
      view3D.updateLights(myState.lights);
    });
  lighting
    .add(myState.lights[1], "mDistance")
    .max(10.0)
    .min(0.0)
    .step(0.1)
    .onChange(function (value) {
      view3D.updateLights(myState.lights);
    });
  lighting
    .add(myState, "lightTheta")
    .max(180.0)
    .min(-180.0)
    .step(1)
    .onChange(function (value) {
      myState.lights[1].mTheta = (value * Math.PI) / 180.0;
      view3D.updateLights(myState.lights);
    });
  lighting
    .add(myState, "lightPhi")
    .max(180.0)
    .min(0.0)
    .step(1)
    .onChange(function (value) {
      myState.lights[1].mPhi = (value * Math.PI) / 180.0;
      view3D.updateLights(myState.lights);
    });
  lighting
    .add(myState.lights[1], "mWidth")
    .max(100.0)
    .min(0.01)
    .step(0.1)
    .onChange(function (value) {
      myState.lights[1].mWidth = value;
      myState.lights[1].mHeight = value;
      view3D.updateLights(myState.lights);
    });
  lighting
    .add(myState, "lightIntensity")
    .max(1000.0)
    .min(0.01)
    .step(0.1)
    .onChange(function (value) {
      myState.lights[1].mColor = new Vector3(
        (myState.lightColor[0] / 255.0) * myState.lightIntensity,
        (myState.lightColor[1] / 255.0) * myState.lightIntensity,
        (myState.lightColor[2] / 255.0) * myState.lightIntensity
      );
      view3D.updateLights(myState.lights);
    });
  lighting
    .addColor(myState, "lightColor", 255)
    .name("lightcolor")
    .onChange(function (value) {
      myState.lights[1].mColor = new Vector3(
        (myState.lightColor[0] / 255.0) * myState.lightIntensity,
        (myState.lightColor[1] / 255.0) * myState.lightIntensity,
        (myState.lightColor[2] / 255.0) * myState.lightIntensity
      );
      view3D.updateLights(myState.lights);
    });

  return gui;
}
