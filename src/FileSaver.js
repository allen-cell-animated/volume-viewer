const FileSaver = {
  save(blob, fname) {
    var url = window.URL.createObjectURL(blob);
    var anch = document.createElement("a");
    anch.href = url;
    anch.download = fname;
    anch.style.display = "none";
    document.body.appendChild(anch);
    anch.click();
    document.body.removeChild(anch);
    window.URL.revokeObjectURL(url);
  },

  saveString(s, fname) {
    var blob = new Blob([s], { type: "text/plain;charset=utf-8" });
    FileSaver.save(blob, fname);
  },

  saveBinary(s, fname) {
    var blob = new Blob([new Uint8Array(s)], {
      type: "application/octet-stream",
    });
    FileSaver.save(blob, fname);
  },

  saveArrayBuffer(buffer, filename) {
    var blob = new Blob([buffer], { type: "application/octet-stream" });
    FileSaver.save(blob, filename);
  },
};

export default FileSaver;
