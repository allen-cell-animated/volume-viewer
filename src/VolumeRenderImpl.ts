import { Euler, Object3D, Vector3 } from "three";
import { ThreeJsPanel } from "./ThreeJsPanel";

export interface VolumeRenderImpl {
  get3dObject: () => Object3D;
  setRayStepSizes: (_rayStepSize: number, _secondaryRayStepSize: number) => void;
  setScale: (_scale: Vector3) => void;
  setOrthoScale: (_scale: number) => void;
  setResolution: (_x: number, _y: number) => void;
  setAxisClip: (_axis: "x" | "y" | "z", _minval: number, _maxval: number, _isOrthoAxis: boolean) => void;
  setIsOrtho: (_isOrtho: boolean) => void;
  setOrthoThickness: (_thickness: number) => void;
  setInterpolationEnabled: (_enabled: boolean) => void;
  setGamma: (_gmin: number, _glevel: number, _gmax: number) => void;
  setFlipAxes: (_flipX: number, _flipY: number, _flipZ: number) => void;
  doRender: (_canvas: ThreeJsPanel) => void;
  cleanup: () => void;
  onChannelData: (_batch: number[]) => void;
  setVisible: (_visible: boolean) => void;
  setBrightness: (_brightness: number) => void;
  setDensity: (_density: number) => void;
  setChannelAsMask: (_channel: number) => boolean;
  setMaskAlpha: (_alpha: number) => void;
  setShowBoundingBox: (_show: boolean) => void;
  setBoundingBoxColor: (_color: [number, number, number]) => void;
  viewpointMoved: () => void;
  updateClipRegion: (_xmin: number, _xmax: number, _ymin: number, _ymax: number, _zmin: number, _zmax: number) => void;
  setPixelSamplingRate: (_rate: number) => void;
  setRenderUpdateListener: (_listener?: (iteration: number) => void) => void;
  setTranslation: (_translation: Vector3) => void;
  setRotation: (_rotation: Euler) => void;
}
