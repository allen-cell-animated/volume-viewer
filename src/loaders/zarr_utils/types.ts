import * as zarr from "@zarrita/core";

import WrappedStore from "./WrappedStore";
import SubscribableRequestQueue from "../../utils/SubscribableRequestQueue";

export type TCZYX<T> = [T, T, T, T, T];
export type SubscriberId = ReturnType<SubscribableRequestQueue["addSubscriber"]>;

/**
 * Directions in which to move outward from the loaded set of chunks while prefetching.
 *
 * Ordered in pairs of opposite directions both because that's a sensible order in which to prefetch for our purposes,
 * and because it lets us treat the least significant bit as the sign. So `direction >> 1` gives the index of the
 * direction in TZYX-ordered arrays, and `direction & 1` gives the sign of the direction (e.g. positive vs negative Z).
 */
export const enum PrefetchDirection {
  T_MINUS = 0,
  T_PLUS = 1,

  Z_MINUS = 2,
  Z_PLUS = 3,

  Y_MINUS = 4,
  Y_PLUS = 5,

  X_MINUS = 6,
  X_PLUS = 7,
}

export type OMECoordinateTransformation =
  | {
      type: "identity";
    }
  | {
      type: "translation";
      translation: number[];
    }
  | {
      type: "scale";
      scale: number[];
    }
  | {
      type: "translation" | "scale";
      path: string;
    };

export type OMEAxis = {
  name: string;
  type?: string;
  unit?: string;
};

export type OMEDataset = {
  path: string;
  coordinateTransformations?: OMECoordinateTransformation[];
};

// https://ngff.openmicroscopy.org/latest/#multiscale-md
export type OMEMultiscale = {
  version?: string;
  name?: string;
  axes: OMEAxis[];
  datasets: OMEDataset[];
  coordinateTransformations?: OMECoordinateTransformation[];
  type?: string;
  metadata?: Record<string, unknown>;
};

// https://ngff.openmicroscopy.org/latest/#omero-md
export type OmeroTransitionalMetadata = {
  id: number;
  name: string;
  version: string;
  channels: {
    active: boolean;
    coefficient: number;
    color: string;
    family: string;
    inverted: boolean;
    label: string;
    window: {
      end: number;
      max: number;
      min: number;
      start: number;
    };
  }[];
};

export type OMEZarrMetadata = {
  multiscales: OMEMultiscale[];
  omero: OmeroTransitionalMetadata;
};

export type NumericZarrArray = zarr.Array<zarr.NumberDataType, WrappedStore<RequestInit>>;

/** A record with everything we need to access and use a single remote source of multiscale OME-Zarr data. */
export type ZarrSource = {
  /** Representations of each scale level in this zarr. We pick one and pass it to zarrita to load data. */
  scaleLevels: NumericZarrArray[];
  /**
   * Zarr dimensions may be ordered in many ways or missing altogether (e.g. TCXYZ, TYX). `axesTCZYX` represents
   * dimension order as a mapping from dimensions to their indices in dimension-ordered arrays for this source.
   */
  axesTCZYX: TCZYX<number>;
  /** OME-specified metadata record with most useful info on the current image, e.g. sizes, axis order, etc. */
  multiscaleMetadata: OMEMultiscale;
  /** OME-specified "transitional" metadata record which we mostly ignore, but which gives channel & volume names. */
  omeroMetadata: OmeroTransitionalMetadata;
  /** Which channels in the volume come out of this source - i.e. source channel 0 is volume channel `channelOffset` */
  channelOffset: number;
};
