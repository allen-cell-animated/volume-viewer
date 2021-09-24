export default class Timing {
  private beginTime: number;
  private prevTime: number;
  private frames: number;
  private lastFrameMs: number;
  private lastFPS: number;

  constructor() {
    this.beginTime = (performance || Date).now();
    this.prevTime = this.beginTime;
    this.frames = 0;

    this.lastFrameMs = 0;
    this.lastFPS = 0;
  }

  begin(): void {
    this.beginTime = (performance || Date).now();
  }

  end(): number {
    this.frames++;
    const time = (performance || Date).now();
    this.lastFrameMs = time - this.beginTime;

    // wait at least a second's worth of frames, to update FPS.
    if (time >= this.prevTime + 1000) {
      this.lastFPS = (this.frames * 1000) / (time - this.prevTime);
      this.prevTime = time;
      this.frames = 0;
    }

    return time;
  }

  update(): void {
    this.beginTime = this.end();
  }
}
