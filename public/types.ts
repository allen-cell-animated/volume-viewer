import { Volume, Light } from "../src";
import { ImageInfo } from "../src/Volume";

export interface State {
    file: string,
    volume: Volume,
    timeSeriesVolumes: Volume[],
    numberOfVolumesCached: number,
    totalFrames: number,
    currentFrame: number,
    timerId: number,

    density: number,
    maskAlpha: number,
    exposure: number,
    aperture: number,
    fov: number,
    focalDistance: number,

    lights: Light[],

    skyTopIntensity: number,
    skyMidIntensity: number,
    skyBotIntensity: number,
    skyTopColor: number[],
    skyMidColor: number[],
    skyBotColor: number[],

    lightColor: number[],
    lightIntensity: number,
    lightTheta: number,
    lightPhi: number,

    xmin: number,
    ymin: number,
    zmin: number,
    xmax: number,
    ymax: number,
    zmax: number,

    samplingRate: number,
    primaryRay: number,
    secondaryRay: number,

    isPT: boolean,

    isTurntable: boolean,
    isAxisShowing: boolean,
    isAligned: boolean,

    flipX: number,
    flipY: number,
    flipZ: number,

    channelFolderNames: string[],
    infoObj: ImageInfo,
}