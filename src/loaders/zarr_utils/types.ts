import SubscribableRequestQueue from "../../utils/SubscribableRequestQueue";

export type TCZYX<T> = [T, T, T, T, T];
export type SubscriberId = ReturnType<SubscribableRequestQueue["addSubscriber"]>;

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
