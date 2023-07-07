import { Euler, Object3D, Vector3 } from "three";
import { ThreeJsPanel } from "./ThreeJsPanel";
import { VolumeRenderSettings } from "./VolumeRenderSettings";
import Volume from "./Volume";

export interface VolumeRenderImpl {
  updateSettings: (settings: VolumeRenderSettings) => void;
  
  get3dObject: () => Object3D;
  doRender: (_canvas: ThreeJsPanel) => void;
  cleanup: () => void;
  viewpointMoved: () => void;
  setRenderUpdateListener: (_listener?: (iteration: number) => void) => void;
}
