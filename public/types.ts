import { Volume, Light } from "../src";
import { VolumeFileFormat } from "../src/loaders";
import { IVolumeLoader } from "../src/loaders/IVolumeLoader";
import { ImageInfo } from "../src/Volume";

export interface TestDataSpec {
  type: VolumeFileFormat | "opencell" | "procedural";
  url: string;
  /** Optional fallback for JSON volumes which don't specify a value for `times` */
  times?: number;
}

export interface State {
  file: string;
  volume: Volume;
  totalFrames?: number;
  currentFrame: number;
  lastFrameTime: number;
  isPlaying: boolean;
  timerId: number;

  loader: IVolumeLoader;

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
  isMP: boolean;
  interpolationActive: boolean;

  isTurntable: boolean;
  isAxisShowing: boolean;
  isAligned: boolean;

  showScaleBar: boolean;

  showBoundingBox: boolean;
  boundingBoxColor: [number, number, number];

  backgroundColor: [number, number, number];

  flipX: -1 | 1;
  flipY: -1 | 1;
  flipZ: -1 | 1;

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
  reset: (channelNum: number) => void;
  autoIJ: (channelNum: number) => void;
  auto0: (channelNum: number) => void;
  bestFit: (channelNum: number) => void;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  pct50_98: (channelNum: number) => void;
  colorizeEnabled: boolean;
  colorize: (channelNum: number) => void;
  colorizeAlpha: number;
}
