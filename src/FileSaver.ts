export default class FileSaver {
  static save(blob: Blob, fname: string): void {
    const url = window.URL.createObjectURL(blob);
    const anch = document.createElement("a");
    anch.href = url;
    anch.download = fname;
    anch.style.display = "none";
    document.body.appendChild(anch);
    anch.click();
    document.body.removeChild(anch);
    window.URL.revokeObjectURL(url);
  }

  static saveString(s: string, fname: string): void {
    const blob = new Blob([s], { type: "text/plain;charset=utf-8" });
    FileSaver.save(blob, fname);
  }

  static saveBinary(s: ArrayBuffer, fname: string): void {
    const blob = new Blob([new Uint8Array(s)], {
      type: "application/octet-stream",
    });
    FileSaver.save(blob, fname);
  }

  static saveArrayBuffer(buffer: BlobPart, filename: string): void {
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    FileSaver.save(blob, filename);
  }
}
