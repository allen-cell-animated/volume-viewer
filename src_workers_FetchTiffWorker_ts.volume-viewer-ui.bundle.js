/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/workers/FetchTiffWorker.ts":
/*!****************************************!*\
  !*** ./src/workers/FetchTiffWorker.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var geotiff__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! geotiff */ "./node_modules/geotiff/dist-module/geotiff.js");

// from TIFF
const SAMPLEFORMAT_UINT = 1;
const SAMPLEFORMAT_INT = 2;
const SAMPLEFORMAT_IEEEFP = 3;
function castToArray(buf, bytesPerPixel, sampleFormat) {
  if (sampleFormat === SAMPLEFORMAT_IEEEFP) {
    if (bytesPerPixel === 4) {
      return new Float32Array(buf);
    }
  } else if (sampleFormat === SAMPLEFORMAT_INT) {
    if (bytesPerPixel === 1) {
      return new Int8Array(buf);
    } else if (bytesPerPixel === 2) {
      return new Int16Array(buf);
    } else if (bytesPerPixel === 4) {
      return new Int32Array(buf);
    }
  } else if (sampleFormat === SAMPLEFORMAT_UINT) {
    if (bytesPerPixel === 1) {
      return new Uint8Array(buf);
    } else if (bytesPerPixel === 2) {
      return new Uint16Array(buf);
    } else if (bytesPerPixel === 4) {
      return new Uint32Array(buf);
    }
  }
  console.error(`TIFF Worker: unsupported sample format ${sampleFormat} and bytes per pixel ${bytesPerPixel}`);
  return new Uint8Array(buf);
}
self.onmessage = async function (e) {
  // TODO index images by time
  // const time = e.data.time;

  const channelIndex = e.data.channel;
  const tilesizex = e.data.tilesizex;
  const tilesizey = e.data.tilesizey;
  const sizez = e.data.sizez;
  const sizec = e.data.sizec;
  const dimensionOrder = e.data.dimensionOrder;
  const bytesPerSample = e.data.bytesPerSample;
  const tiff = await (0,geotiff__WEBPACK_IMPORTED_MODULE_0__.fromUrl)(e.data.url, {
    allowFullFile: true
  });

  // load the images of this channel from the tiff
  // today assume TCZYX so the slices are already in order.
  let startindex = 0;
  let incrementz = 1;
  if (dimensionOrder === "XYZCT") {
    // we have XYZCT which is the "good" case
    // TCZYX
    startindex = sizez * channelIndex;
    incrementz = 1;
  } else if (dimensionOrder === "XYCZT") {
    // we have to loop differently to increment channels
    // TZCYX
    startindex = channelIndex;
    incrementz = sizec;
  }

  // huge assumption: planes are in a particular order relative to z and c

  // get first plane, to get some details about the image
  const image = await tiff.getImage(startindex);
  // on first image, set up some stuff:
  const sampleFormat = image.getSampleFormat();
  const bytesPerPixel = image.getBytesPerPixel();
  // allocate a buffer for one channel
  const buffer = new ArrayBuffer(tilesizex * tilesizey * sizez * bytesPerPixel);
  const u8 = new Uint8Array(buffer);
  for (let imageIndex = startindex, zslice = 0; zslice < sizez; imageIndex += incrementz, ++zslice) {
    const image = await tiff.getImage(imageIndex);
    // download and downsample on client
    const result = await image.readRasters({
      width: tilesizex,
      height: tilesizey
    });
    const arrayresult = Array.isArray(result) ? result[0] : result;
    // deposit in full channel array in the right place
    const offset = zslice * tilesizex * tilesizey;
    if (arrayresult.BYTES_PER_ELEMENT > 4) {
      console.log("byte size not supported yet");
    } else if (arrayresult.BYTES_PER_ELEMENT !== bytesPerSample) {
      console.log("tiff bytes per element mismatch with OME metadata");
    } else {
      u8.set(new Uint8Array(arrayresult.buffer), offset * arrayresult.BYTES_PER_ELEMENT);
    }
  }
  // all slices collected, now resample to 8 bits full data range
  const src = castToArray(buffer, bytesPerPixel, sampleFormat);
  let chmin = src[0];
  let chmax = src[0];
  for (let j = 0; j < src.length; ++j) {
    const val = src[j];
    if (val < chmin) {
      chmin = val;
    }
    if (val > chmax) {
      chmax = val;
    }
  }
  const out = new Uint8Array(src.length);
  for (let j = 0; j < src.length; ++j) {
    out[j] = (src[j] - chmin) / (chmax - chmin) * 255;
  }
  const results = {
    data: out,
    channel: channelIndex,
    range: [chmin, chmax]
  };
  self.postMessage(results, [results.data.buffer]);
};

/***/ }),

/***/ "?cdec":
/*!**********************!*\
  !*** http (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?753a":
/*!***********************!*\
  !*** https (ignored) ***!
  \***********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?4e4d":
/*!*********************!*\
  !*** url (ignored) ***!
  \*********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?662e":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_geotiff_dist-module_geotiff_js"], () => (__webpack_require__("./src/workers/FetchTiffWorker.ts")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".volume-viewer-ui.bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			"src_workers_FetchTiffWorker_ts": 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_aics_volume_viewer"] = self["webpackChunk_aics_volume_viewer"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return __webpack_require__.e("vendors-node_modules_geotiff_dist-module_geotiff_js").then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
//# sourceMappingURL=src_workers_FetchTiffWorker_ts.volume-viewer-ui.bundle.js.map