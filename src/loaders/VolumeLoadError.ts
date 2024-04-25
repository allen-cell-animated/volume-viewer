export default class VolumeLoadError extends Error {
  constructor(message: string, options?: { cause?: string }) {
    super(message, options);
    this.name = "VolumeLoadError";
  }
}
