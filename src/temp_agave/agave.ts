import { CommandBuffer, COMMANDS } from "./commandbuffer";

export type JSONValue = string | number | boolean | { [x: string]: JSONValue } | Array<JSONValue>;

export class AgaveClient {
  private binarysocket0: WebSocket;
  private cb: CommandBuffer;
  private sessionName: string;
  private onOpen: () => void;
  private onJson: (json: JSONValue) => void;
  private onImage: (data: Blob) => void;

  constructor(
    url = "ws://localhost:1235/",
    rendermode = "pathtrace",
    onOpen = () => {
      0;
    },
    onJson = (_json: JSONValue) => {
      0;
    },
    onImage = (_data: Blob) => {
      0;
    }
  ) {
    if (rendermode !== "pathtrace" && rendermode !== "raymarch") {
      rendermode = "pathtrace";
    }
    this.onOpen = onOpen;
    this.onJson = onJson;
    this.onImage = onImage;

    // First order of business: connect!
    this.binarysocket0 = new WebSocket(url + "?mode=" + rendermode);

    // set binarytype according to how we expect clients to deal with received image data
    this.binarysocket0.binaryType = "blob"; //"arraybuffer";

    // do some stuff on initial connection
    this.binarysocket0.onopen = (_ev: Event) => {
      this.setResolution(256, 256);
      // put agave in streaming mode from the get-go
      this.streamMode(1);
      this.flushCommandBuffer();

      // user provided callback
      if (this.onOpen) {
        this.onOpen();
      }
    };

    // TODO - handle this better
    this.binarysocket0.onclose = (_ev: CloseEvent) => {
      setTimeout(function () {
        console.warn("connection failed. refresh to retry.");
      }, 3000);
    };

    // handle incoming messages
    this.binarysocket0.onmessage = (evt: MessageEvent<unknown>) => {
      if (typeof evt.data === "string") {
        const returnedObj = JSON.parse(evt.data);
        if (returnedObj.commandId === COMMANDS.LOAD_DATA[0]) {
          console.log(returnedObj);
          // let users do something with this data
          if (this.onJson) {
            this.onJson(returnedObj);
          }
        }
        return;
      }

      const arraybuf = evt.data;
      // let users do something with this data
      if (this.onImage) {
        this.onImage(arraybuf as Blob);
      }
    };

    // TODO handle this better
    this.binarysocket0.onerror = (evt: Event) => {
      console.log("error", evt);
    };

    this.cb = new CommandBuffer();
    this.sessionName = "";
  }

  isReady(): boolean {
    return this.binarysocket0.readyState === 1;
  }

  /**
   * Set the current session name.  Use the full path to the name of the output
   * image here.
   *
   * @param name This name is the full path to the output image, ending in .png or .jpg.
   * Make sure the directory has already been created.
   *
   */
  session(name: string) {
    // 0
    this.cb.addCommand("SESSION", name);
    this.sessionName = name;
  }
  /**
   * Sets a search path for volume files. NOT YET IMPLEMENTED.
   *
   * @param name This name is the path where volume images are located.
   */
  assetPath(name: string) {
    // 1
    this.cb.addCommand("ASSET_PATH", name);
  }
  // load_ome_tif(name: string) {
  //   /*
  // DEPRECATED. Use load_data
  // */
  //   // 2
  //   this.cb.addCommand("LOAD_OME_TIF", name);
  // }

  /**
   * Set the viewer camera position. Default is (500,500,500).
   *
   * @param x The x coordinate
   * @param y The y coordinate
   * @param z The z coordinate
   */
  eye(x: number, y: number, z: number) {
    // 3
    this.cb.addCommand("EYE", x, y, z);
  }

  /**
   * Set the viewer target position. This is a point toward which we are looking.
   * Default is (0,0,0).
   *
   * @param x The x coordinate
   * @param y The y coordinate
   * @param z The z coordinate
   */
  target(x: number, y: number, z: number) {
    // 4
    this.cb.addCommand("TARGET", x, y, z);
  }

  /**
   * Set the viewer camera up direction.  This is a vector which should be nearly
   * perpendicular to the view direction (target-eye), and defines the "roll" amount
   * for the camera.
   * Default is (0,0,1).
   *
   * @param x The x coordinate
   * @param y The y coordinate
   * @param z The z coordinate
   */
  up(x: number, y: number, z: number) {
    // 5
    this.cb.addCommand("UP", x, y, z);
  }

  /**
   * Set the viewer camera aperture size.
   *
   * @param x The aperture size. This is a number between 0 and 1. 0 means no defocusing will occur, like a pinhole camera.  1 means maximum defocus. Default is 0.
   */
  aperture(x: number) {
    // 6
    this.cb.addCommand("APERTURE", x);
  }

  /**
   * Set the viewer camera projection type, along with a relevant parameter.
   * @param projectionType 0 for Perspective, 1 for Orthographic.  Default: 0
   * @param x If Perspective, then this is the vertical Field of View angle in degrees.
   * If Orthographic, then this is the orthographic scale dimension.
   * Default: 55.0 degrees. (default Orthographic scale is 0.5)
   */
  cameraProjection(projectionType: number, x: number) {
    // 7
    this.cb.addCommand("CAMERA_PROJECTION", projectionType, x);
  }

  /**
   * Set the viewer camera focal distance
   *
   * @param x The focal distance.  Has no effect if aperture is 0.
   */
  focaldist(x: number) {
    // 8
    this.cb.addCommand("FOCALDIST", x);
  }

  /**
   * Set the exposure level
   *
   * @param x The exposure level between 0 and 1. Default is 0.75.  Higher numbers are brighter.
   */
  exposure(x: number) {
    // 9
    this.cb.addCommand("EXPOSURE", x);
  }

  /**
   * Set the diffuse color of a channel
   *
   * @param channel Which channel index, 0 based.
   * @param r The red value between 0 and 1
   * @param g The green value between 0 and 1
   * @param b The blue value between 0 and 1
   * @param a The alpha value between 0 and 1 (currently unused)
   */
  matDiffuse(channel: number, r: number, g: number, b: number, a: number) {
    // 10
    this.cb.addCommand("MAT_DIFFUSE", channel, r, g, b, a);
  }

  /**
   * Set the specular color of a channel (defaults to black, for no specular
   * response)
   *
   * @param channel Which channel index, 0 based.
   * @param r The red value between 0 and 1
   * @param g The green value between 0 and 1
   * @param b The blue value between 0 and 1
   * @param a The alpha value between 0 and 1 (currently unused)
   */
  matSpecular(channel: number, r: number, g: number, b: number, a: number) {
    // 11
    this.cb.addCommand("MAT_SPECULAR", channel, r, g, b, a);
  }

  /**
   * Set the emissive color of a channel (defaults to black, for no emission)
   *
   * @param channel Which channel index, 0 based.
   * @param r The red value between 0 and 1
   * @param g The green value between 0 and 1
   * @param b The blue value between 0 and 1
   * @param a The alpha value between 0 and 1 (currently unused)
   */
  matEmissive(channel: number, r: number, g: number, b: number, a: number) {
    // 12
    this.cb.addCommand("MAT_EMISSIVE", channel, r, g, b, a);
  }

  /**
   * Set the number of paths per pixel to accumulate.
   *
   * @param x How many paths per pixel. The more paths, the less noise in the image.
   */
  renderIterations(x: number) {
    // 13
    this.cb.addCommand("RENDER_ITERATIONS", x);
  }

  /**
   * Turn stream mode on or off.  Stream mode will send an image back to the client
   * on each iteration up to some server-defined amount.  This mode is useful for
   * interactive client-server applications but not for batch-mode offline rendering.
   *
   * @param x 0 for off, 1 for on. Default is off.
   */
  streamMode(x: number) {
    // 14
    this.cb.addCommand("STREAM_MODE", x);
  }

  /**
   * Tell the server to process all commands and return an image
   * TODO , and then save the image.
   * TODO This function will block and wait for the image to be returned.
   * TODO The image returned will be saved automatically using the session_name.
   * TODO: a timeout is not yet implemented.
   */
  redraw() {
    // 15
    // issue command buffer
    this.cb.addCommand("REDRAW");
    this.flushCommandBuffer();
    // //  and then WAIT for render to be completed
    // binarydata = this.ws.wait_for_image();
    // // and save image
    // im = Image.open(binarydata);
    // print(this.session_name);
    // im.save(this.session_name);
    // // ready for next frame
    // this.session_name = "";
  }

  /**
   * Set the image resolution in pixels.
   *
   * @param x x resolution in pixels
   * @param y y resolution in pixels
   */
  setResolution(x: number, y: number) {
    // 16
    this.cb.addCommand("SET_RESOLUTION", x, y);
  }

  /**
   * Set the scattering density.
   *
   * @param x The scattering density, 0-100.  Higher values will make the volume seem
   * more opaque. Default is 8.5, which is relatively transparent.
   */
  density(x: number) {
    // 17
    this.cb.addCommand("DENSITY", x);
  }

  /**
   * Automatically set camera parameters so that the volume fills the view.
   * Useful when you have insufficient information to position the camera accurately.
   */
  frameScene() {
    // 18
    this.cb.addCommand("FRAME_SCENE");
  }

  /**
   * Set the channel's glossiness.
   *
   * @param channel Which channel index, 0 based.
   * @param glossiness Sets the shininess, a number between 0 and 100.
   */
  matGlossiness(channel: number, glossiness: number) {
    // 19
    this.cb.addCommand("MAT_GLOSSINESS", channel, glossiness);
  }

  /**
   * Show or hide a given channel
   *
   * @param channel Which channel index, 0 based.
   * @param enabled 0 to hide, 1 to show
   */
  enableChannel(channel: number, enabled: number) {
    // 20
    this.cb.addCommand("ENABLE_CHANNEL", channel, enabled);
  }

  /**
   * Set intensity threshold for a given channel based on Window/Level
   *
   * @param channel Which channel index, 0 based.
   * @param window Width of the window, from 0-1.
   * @param level Intensity level mapped to middle of window, from 0-1
   */
  setWindowLevel(channel: number, window: number, level: number) {
    // 21
    this.cb.addCommand("SET_WINDOW_LEVEL", channel, window, level);
  }

  /**
   * Rotate the camera around the volume by angle deltas
   *
   * @param theta polar angle in degrees
   * @param phi azimuthal angle in degrees
   */
  orbitCamera(theta: number, phi: number) {
    // 22
    this.cb.addCommand("ORBIT_CAMERA", theta, phi);
  }

  /**
   * Rotate the camera around the volume by angle deltas
   *
   * @param theta vertical screen angle in degrees
   * @param phi horizontal screen angle in degrees
   */
  trackballCamera(theta: number, phi: number) {
    // 43
    this.cb.addCommand("TRACKBALL_CAMERA", theta, phi);
  }

  /**
   * Set the "north pole" color of the sky sphere
   *
   * @param r The red value between 0 and 1
   * @param g The green value between 0 and 1
   * @param b The blue value between 0 and 1
   */
  skylightTopColor(r: number, g: number, b: number) {
    // 23
    this.cb.addCommand("SKYLIGHT_TOP_COLOR", r, g, b);
  }

  /**
   * Set the "equator" color of the sky sphere
   *
   * @param r The red value between 0 and 1
   * @param g The green value between 0 and 1
   * @param b The blue value between 0 and 1
   */
  skylightMiddleColor(r: number, g: number, b: number) {
    // 24
    this.cb.addCommand("SKYLIGHT_MIDDLE_COLOR", r, g, b);
  }

  /**
   * Set the "south pole" color of the sky sphere
   *
   * @param r The red value between 0 and 1
   * @param g The green value between 0 and 1
   * @param b The blue value between 0 and 1
   */
  skylightBottomColor(r: number, g: number, b: number) {
    // 25
    this.cb.addCommand("SKYLIGHT_BOTTOM_COLOR", r, g, b);
  }

  /**
   * Set the position of an area light, in spherical coordinates
   *
   * @param index Which light to set.  Currently unused as there is only one area light.
   * @param r The radius, as distance from the center of the volume
   * @param theta The polar angle
   * @param phi The azimuthal angle
   */
  lightPos(index: number, r: number, theta: number, phi: number) {
    // 26
    this.cb.addCommand("LIGHT_POS", index, r, theta, phi);
  }

  /**
   * Set the color of an area light. Overdrive the values higher than 1 to increase
   * the light's intensity.
   *
   * @param index Which light to set.  Currently unused as there is only one area light.
   * @param r The red value between 0 and 1
   * @param g The green value between 0 and 1
   * @param b The blue value between 0 and 1
   */
  lightColor(index: number, r: number, g: number, b: number) {
    // 27
    this.cb.addCommand("LIGHT_COLOR", index, r, g, b);
  }

  /**
   * Set the size dimensions of a rectangular area light.
   *
   * @param index Which light to set.  Currently unused as there is only one area light.
   * @param x The width dimension of the area light
   * @param y The height dimension of the area light
   */
  lightSize(index: number, x: number, y: number) {
    // 28
    this.cb.addCommand("LIGHT_SIZE", index, x, y);
  }

  /**
   * Set the axis aligned region of interest of the volume. All axis values are
   * relative, where 0 is one extent of the volume and 1 is the opposite extent.
   * For example, (0,1, 0,1, 0,0.5) will select the lower half of the volume's z
   * slices.
   *
   * @param minx The lower x extent between 0 and 1
   * @param maxx The higher x extent between 0 and 1
   * @param miny The lower y extent between 0 and 1
   * @param maxy The higher y extent between 0 and 1
   * @param minz The lower z extent between 0 and 1
   * @param maxz The higher z extent between 0 and 1
   */
  setClipRegion(minx: number, maxx: number, miny: number, maxy: number, minz: number, maxz: number) {
    // 29
    this.cb.addCommand("SET_CLIP_REGION", minx, maxx, miny, maxy, minz, maxz);
  }

  /**
   * Set the relative scale of the pixels in the volume. Typically this is filled in
   * with the physical pixel dimensions from the microscope metadata.  Often the x
   * and y scale will differ from the z scale.  Defaults to (1,1,1)
   *
   * @param x x scale
   * @param y y scale
   * @param z z scale
   */
  setVoxelScale(x: number, y: number, z: number) {
    // 30
    this.cb.addCommand("SET_VOXEL_SCALE", x, y, z);
  }

  /**
   * Automatically determine the intensity thresholds
   *
   * @param channel Which channel index, 0 based.
   * @param method Allowed values:
   * 0: Auto2
   * 1: Auto
   * 2: BestFit
   * 3: ChimeraX emulation
   * 4: between 0.5 percentile and 0.98 percentile
   */
  autoThreshold(channel: number, method: number) {
    // 31
    this.cb.addCommand("AUTO_THRESHOLD", channel, method);
  }

  /**
   * Set intensity thresholds based on percentiles of pixels to clip min and max
   * intensity
   *
   * @param channel Which channel index, 0 based.
   * @param pctLow The low percentile to remap to 0(min) intensity
   * @param pctHigh The high percentile to remap to 1(max) intensity
   */
  setPercentileThreshold(channel: number, pctLow: number, pctHigh: number) {
    // 32
    this.cb.addCommand("SET_PERCENTILE_THRESHOLD", channel, pctLow, pctHigh);
  }

  /**
   * Set channel opacity. This is a multiplier against all intensity values in the
   * channel.
   *
   * @param channel Which channel index, 0 based.
   * @param opacity A multiplier between 0 and 1. Default is 1
   */
  matOpacity(channel: number, opacity: number) {
    // 33
    this.cb.addCommand("MAT_OPACITY", channel, opacity);
  }

  /**
   * Set primary ray step size. This is an accuracy versus speed tradeoff.  Low
   * values are more accurate. High values will render faster.
   * Primary rays are the rays that are cast from the camera out into the volume.
   *
   * @param stepSize A value in voxels. Default is 4.  Minimum sensible value is 1.
   */
  setPrimaryRayStepSize(stepSize: number) {
    // 34
    this.cb.addCommand("SET_PRIMARY_RAY_STEP_SIZE", stepSize);
  }

  /**
   * Set secondary ray step size. This is an accuracy versus speed tradeoff.  Low
   * values are more accurate. High values will render faster.
   * The secondary rays are rays which are cast toward lights after they have
   * scattered within the volume.
   *
   * @param stepSize A value in voxels. Default is 4.  Minimum sensible value is 1.
   */
  setSecondaryRayStepSize(stepSize: number) {
    // 35
    this.cb.addCommand("SET_SECONDARY_RAY_STEP_SIZE", stepSize);
  }

  /**
   * Set the background color of the rendering
   *
   * @param r The red value between 0 and 1
   * @param g The green value between 0 and 1
   * @param b The blue value between 0 and 1
   */
  backgroundColor(r: number, g: number, b: number) {
    // 36
    this.cb.addCommand("BACKGROUND_COLOR", r, g, b);
  }

  /**
   * Set intensity thresholds based on values around an isovalue.
   *
   * @param channel Which channel index, 0 based.
   * @param isovalue The value to center at maximum intensity, between 0 and 1
   * @param isorange A range around the isovalue to keep at constant intensity, between 0 and 1.
   * Typically small, to select for a single isovalue.
   */
  setIsovalueThreshold(channel: number, isovalue: number, isorange: number) {
    // 37
    this.cb.addCommand("SET_ISOVALUE_THRESHOLD", channel, isovalue, isorange);
  }

  /**
   * Set intensity thresholds based on a piecewise linear transfer function.
   *
   * @param channel Which channel index, 0 based.
   * @param data An array of values.  5 floats per control point.  first is position (0-1),
   * next four are rgba (all 0-1).  Only alpha is currently used as the remapped
   * intensity value.  All others are linearly interpolated.
   */
  setControlPoints(channel: number, data: number[]) {
    // 38
    this.cb.addCommand("SET_CONTROL_POINTS", channel, data);
  }

  // load_volume_from_file(path: string, scene: number, time: number) {
  //   /*
  // DEPRECATED. Use load_data
  // */
  //   // 39
  //   this.cb.addCommand("LOAD_VOLUME_FROM_FILE", path, scene, time);
  // }

  /**
   * Load a time from the current volume file
   *
   * @param time zero-based index to select the time sample.  Defaults to 0
   */
  setTime(time: number) {
    // 40
    this.cb.addCommand("SET_TIME", time);
  }

  /**
   * Set the color for the bounding box display
   *
   * @param r the red value, from 0 to 1
   * @param g the green value, from 0 to 1
   * @param b the blue value, from 0 to 1
   */
  boundingBoxColor(r: number, g: number, b: number) {
    // 41
    this.cb.addCommand("SET_BOUNDING_BOX_COLOR", r, g, b);
  }

  /**
   * Turn bounding box display on or off
   *
   * @param on 0 to hide bounding box, 1 to show it
   */
  showBoundingBox(on: number) {
    // 42
    this.cb.addCommand("SHOW_BOUNDING_BOX", on);
  }

  /**
   * Completely specify volume data to load
   *
   * @param path URL or directory or file path to the data. The path must be locally
   * accessible from the AGAVE server.
   * @param scene zero-based index to select the scene, for multi-scene files. Defaults to 0
   * @param multiresolutionLevel zero-based index to select the multiresolution level.  Defaults to 0
   * @param time zero-based index to select the time sample.  Defaults to 0
   * @param channels zero-based indices to select the channels.  Defaults to all channels
   * @param region 6 integers specifying the region to load.  Defaults to the entire volume.
   * Any list length other than 0 or 6 is an error.
   */
  loadData(
    path: string,
    scene = 0,
    multiresolutionLevel = 0,
    time = 0,
    channels: number[] = [],
    region: number[] = []
  ) {
    // 44
    this.cb.addCommand("LOAD_DATA", path, scene, multiresolutionLevel, time, channels, region);
  }

  // send all data in our current command buffer to the server
  flushCommandBuffer() {
    if (this.cb.length() > 0) {
      const buf = this.cb.prebufferToBuffer();
      this.binarysocket0.send(buf);
      // assuming the buffer is sent, prepare a new one
      this.cb = new CommandBuffer();
    }
  }
}
