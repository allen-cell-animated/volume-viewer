import { Object3D } from "three";
import { ThreeJsPanel } from "./ThreeJsPanel";
import { VolumeRenderSettings } from "./VolumeRenderSettings";
import { FuseChannel } from "./types";
import Channel from "./Channel";

export interface VolumeRenderImpl {
  /**
   * Applies the given VolumeRenderSettings to this volume renderer.
   * @param settings a VolumeRenderSettings object to update values from.
   */
  updateSettings: (settings: VolumeRenderSettings) => void;

  get3dObject: () => Object3D;
  doRender: (_canvas: ThreeJsPanel) => void;
  cleanup: () => void;
  viewpointMoved: () => void;
  setRenderUpdateListener: (_listener?: (iteration: number) => void) => void;
  updateActiveChannels: (channelcolors: FuseChannel[], channeldata: Channel[]) => void;
}
