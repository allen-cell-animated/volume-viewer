// types:
//   FLOAT32(f)
//   INT32(i)
//   STRING(s)=int32 and array of bytes
//   FLOAT32ARRAY=int32 and array of floats
//   INT32ARRAY=int32 and array of int32s
const types = { I32: 4, F32: 4, S: -1, F32A: -1, I32A: -1 };
type CmdArgs = string | number | number[];

// command id will be int32 to future-proof it.
// note that the server needs to know these signatures too.
export const COMMANDS = {
  // tell server to identify this session?
  SESSION: [0, "S"],
  // tell server where files might be (appends to existing)
  ASSET_PATH: [1, "S"],
  // load a volume (DEPRECATED)
  LOAD_OME_TIF: [2, "S"],
  // set camera pos
  EYE: [3, "F32", "F32", "F32"],
  // set camera target pt
  TARGET: [4, "F32", "F32", "F32"],
  // set camera up direction
  UP: [5, "F32", "F32", "F32"],
  APERTURE: [6, "F32"],
  // perspective(0)/ortho(1), fov(degrees)/orthoscale(world units)
  CAMERA_PROJECTION: [7, "I32", "F32"],
  FOCALDIST: [8, "F32"],
  EXPOSURE: [9, "F32"],
  MAT_DIFFUSE: [10, "I32", "F32", "F32", "F32", "F32"],
  MAT_SPECULAR: [11, "I32", "F32", "F32", "F32", "F32"],
  MAT_EMISSIVE: [12, "I32", "F32", "F32", "F32", "F32"],
  // set num render iterations
  RENDER_ITERATIONS: [13, "I32"],
  // (continuous or on-demand frames)
  STREAM_MODE: [14, "I32"],
  // request new image
  REDRAW: [15],
  SET_RESOLUTION: [16, "I32", "I32"],
  DENSITY: [17, "F32"],
  // move camera to bound and look at the scene contents
  FRAME_SCENE: [18],
  MAT_GLOSSINESS: [19, "I32", "F32"],
  // channel index, 1/0 for enable/disable
  ENABLE_CHANNEL: [20, "I32", "I32"],
  // channel index, window, level.  (Do I ever set these independently?)
  SET_WINDOW_LEVEL: [21, "I32", "F32", "F32"],
  // theta, phi in degrees
  ORBIT_CAMERA: [22, "F32", "F32"],
  SKYLIGHT_TOP_COLOR: [23, "F32", "F32", "F32"],
  SKYLIGHT_MIDDLE_COLOR: [24, "F32", "F32", "F32"],
  SKYLIGHT_BOTTOM_COLOR: [25, "F32", "F32", "F32"],
  // r, theta, phi
  LIGHT_POS: [26, "I32", "F32", "F32", "F32"],
  LIGHT_COLOR: [27, "I32", "F32", "F32", "F32"],
  // x by y size
  LIGHT_SIZE: [28, "I32", "F32", "F32"],
  // xmin, xmax, ymin, ymax, zmin, zmax
  SET_CLIP_REGION: [29, "F32", "F32", "F32", "F32", "F32", "F32"],
  // x, y, z pixel scaling
  SET_VOXEL_SCALE: [30, "F32", "F32", "F32"],
  // channel, method
  AUTO_THRESHOLD: [31, "I32", "I32"],
  // channel index, pct_low, pct_high.  (Do I ever set these independently?)
  SET_PERCENTILE_THRESHOLD: [32, "I32", "F32", "F32"],
  MAT_OPACITY: [33, "I32", "F32"],
  SET_PRIMARY_RAY_STEP_SIZE: [34, "F32"],
  SET_SECONDARY_RAY_STEP_SIZE: [35, "F32"],
  // r, g, b
  BACKGROUND_COLOR: [36, "F32", "F32", "F32"],
  // channel index, isovalue, isorange
  SET_ISOVALUE_THRESHOLD: [37, "I32", "F32", "F32"],
  // channel index, array of [stop, r, g, b, a]
  SET_CONTROL_POINTS: [38, "I32", "F32A"],
  // path, scene, time (DEPRECATED)
  LOAD_VOLUME_FROM_FILE: [39, "S", "I32", "I32"],
  // actually loads data
  SET_TIME: [40, "I32"],
  SET_BOUNDING_BOX_COLOR: [41, "F32", "F32", "F32"],
  SHOW_BOUNDING_BOX: [42, "I32"],
  TRACKBALL_CAMERA: [43, "F32", "F32"],
  // path, scene, multiresolution level, t, channel indices, region
  LOAD_DATA: [44, "S", "I32", "I32", "I32", "I32A", "I32A"],
};

// strategy: add elements to prebuffer, and then traverse prebuffer to convert
// to binary before sending?
export class CommandBuffer {
  // [command, args],...
  private prebuffer: CmdArgs[][];
  private buffer: ArrayBuffer | null;
  constructor() {
    this.prebuffer = [];
    this.buffer = null;
  }

  public prebufferToBuffer(): ArrayBuffer {
    // iterate length of prebuffer to compute size.
    let bytesize = 0;
    for (let i = 0; i < this.prebuffer.length; ++i) {
      // for each command.

      // one i32 for the command id.
      bytesize += types.I32;

      const command = this.prebuffer[i];
      const commandCode = command[0] as string;
      const signature = COMMANDS[commandCode];
      if (!signature) {
        console.error("CommandBuffer: Unrecognized command " + commandCode);
      }
      const nArgsExpected = signature.length - 1;
      // for each arg:
      if (command.length - 1 !== nArgsExpected) {
        console.error("BAD COMMAND: EXPECTED " + nArgsExpected + " args and got " + (command.length - 1));
      }

      for (let j = 0; j < nArgsExpected; ++j) {
        // get arg type
        const argtype = signature[j + 1];
        if (argtype === "S") {
          // one int32 for string length
          bytesize += 4;
          // followed by one byte per char.
          bytesize += (command[j + 1] as string).length;
        } else if (argtype === "F32A") {
          // one int32 for array length
          bytesize += 4;
          // followed by 4 bytes per float in the array
          bytesize += 4 * (command[j + 1] as number[]).length;
        } else if (argtype === "I32A") {
          // one int32 for array length
          bytesize += 4;
          // followed by 4 bytes per int32 in the array
          bytesize += 4 * (command[j + 1] as number[]).length;
        } else {
          bytesize += types[argtype];
        }
      }
    }
    // allocate arraybuffer and then fill it.
    this.buffer = new ArrayBuffer(bytesize);
    const dataview = new DataView(this.buffer);
    let offset = 0;
    const LITTLE_ENDIAN = true;
    for (let i = 0; i < this.prebuffer.length; ++i) {
      const cmd = this.prebuffer[i];
      const commandCode = cmd[0] as string;
      const signature = COMMANDS[commandCode];
      const nArgsExpected = signature.length - 1;

      // the numeric code for the command
      dataview.setInt32(offset, signature[0]);
      offset += 4;
      for (let j = 0; j < nArgsExpected; ++j) {
        // get arg type
        const argtype = signature[j + 1];
        switch (argtype) {
          case "S":
            {
              const str = cmd[j + 1] as string;
              dataview.setInt32(offset, str.length);
              offset += 4;
              for (let k = 0; k < str.length; ++k) {
                dataview.setUint8(offset, str.charCodeAt(k));
                offset += 1;
              }
            }
            break;
          case "F32":
            dataview.setFloat32(offset, cmd[j + 1] as number, LITTLE_ENDIAN);
            offset += 4;
            break;
          case "I32":
            dataview.setInt32(offset, cmd[j + 1] as number);
            offset += 4;
            break;
          case "F32A":
            {
              const flist = cmd[j + 1] as number[];
              dataview.setInt32(offset, flist.length);
              offset += 4;
              for (let k = 0; k < flist.length; ++k) {
                dataview.setFloat32(offset, flist[k], LITTLE_ENDIAN);
                offset += 4;
              }
            }
            break;
          case "I32A":
            {
              const ilist = cmd[j + 1] as number[];
              dataview.setInt32(offset, ilist.length);
              offset += 4;
              for (let k = 0; k < ilist.length; ++k) {
                dataview.setInt32(offset, ilist[k], LITTLE_ENDIAN);
                offset += 4;
              }
            }
            break;
        }
      }
    }
    // result is in this.buffer
    return this.buffer;
  }

  // commands are added by command code string name followed by appropriate
  // signature args.
  addCommand(...args: CmdArgs[]) {
    //const args = [].slice.call(arguments);
    // TODO: check against signature!!!
    this.prebuffer.push([...args]);
  }

  length(): number {
    return this.prebuffer.length;
  }
}
