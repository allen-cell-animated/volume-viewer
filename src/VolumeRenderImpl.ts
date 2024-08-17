import { Object3D } from "three";

import { ThreeJsPanel } from "./ThreeJsPanel.js";
import { SettingsFlags, VolumeRenderSettings } from "./VolumeRenderSettings.js";
import type { FuseChannel } from "./types.js";
import Channel from "./Channel.js";

export interface VolumeRenderImpl {
  /**
   * Applies the given VolumeRenderSettings to this volume renderer.
   * @param settings a VolumeRenderSettings object to update values from.
   * @param dirtyFlags bitwise flag used to mark groups of changed settings in the
   * provided `settings` object.
   * If unset, forces recompute of all settings-based renderer configuration.
   * See the `SettingsFlags` enum for recognized values.
   */
  updateSettings: (settings: VolumeRenderSettings, dirtyFlags?: number | SettingsFlags) => void;

  get3dObject: () => Object3D;
  doRender: (_canvas: ThreeJsPanel) => void;
  updateVolumeDimensions: () => void;
  cleanup: () => void;
  viewpointMoved: () => void;
  setRenderUpdateListener: (_listener?: (iteration: number) => void) => void;
  updateActiveChannels: (channelcolors: FuseChannel[], channeldata: Channel[]) => void;
}
