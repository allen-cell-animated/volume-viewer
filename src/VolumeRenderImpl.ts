import { Object3D } from "three";
import { ThreeJsPanel } from "./ThreeJsPanel";
import { VolumeRenderSettings } from "./VolumeRenderSettings";
import { FuseChannel } from "./types";
import Channel from "./Channel";

export interface VolumeRenderImpl {
  updateSettings: (settings: VolumeRenderSettings) => void;
  
  get3dObject: () => Object3D;
  doRender: (_canvas: ThreeJsPanel) => void;
  cleanup: () => void;
  viewpointMoved: () => void;
  setRenderUpdateListener: (_listener?: (iteration: number) => void) => void;
  updateActiveChannels: (channelcolors: FuseChannel[], channeldata: Channel[])=> void;
}
