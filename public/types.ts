import { Volume, Light } from "../src";
import { ImageInfo } from "../src/Volume";

export interface State {
  file: string;
  volume: Volume;
  timeSeriesVolumes: Volume[];
  numberOfVolumesCached: number;
  totalFrames: number;
  currentFrame: number;
  timerId: number;

  density: number;
  maskAlpha: number;
  exposure: number;
  aperture: number;
  fov: number;
  focalDistance: number;

  lights: Light[];

  skyTopIntensity: number;
  skyMidIntensity: number;
  skyBotIntensity: number;
  skyTopColor: [number, number, number];
  skyMidColor: [number, number, number];
  skyBotColor: [number, number, number];

  lightColor: [number, number, number];
  lightIntensity: number;
  lightTheta: number;
  lightPhi: number;

  xmin: number;
  ymin: number;
  zmin: number;
  xmax: number;
  ymax: number;
  zmax: number;

  samplingRate: number;
  primaryRay: number;
  secondaryRay: number;

  isPT: boolean;

  isTurntable: boolean;
  isAxisShowing: boolean;
  isAligned: boolean;

  showBoundingBox: boolean;
  boundingBoxColor: [number, number, number];

  backgroundColor: [number, number, number];

  flipX: number;
  flipY: number;
  flipZ: number;

  channelFolderNames: string[];
  infoObj: ImageInfo;
  channelGui: ChannelGuiOptions[];

  currentImageStore: string;
  currentImageName: string;
}

interface ChannelGuiOptions {
  colorD: [number, number, number];
  colorS: [number, number, number];
  colorE: [number, number, number];
  window: number;
  level: number;
  glossiness: number;
  isovalue: number;
  isosurface: boolean;
  enabled: boolean;
  autoIJ: (channelNum: number) => void;
  auto0: (channelNum: number) => void;
  bestFit: (channelNum: number) => void;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  pct50_98: (channelNum: number) => void;
  colorizeEnabled: boolean;
  colorize: (channelNum: number) => void;
  colorizeAlpha: number;
}
