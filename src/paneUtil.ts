import { Bindable, FolderApi } from "@tweakpane/core";

type ColorArray = [number, number, number];
type ColorObject = { r: number; g: number; b: number };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithObjectColors<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends ColorArray | undefined ? ColorObject : T[K];
};

export const colorArrayToObject = ([r, g, b]: ColorArray): ColorObject => ({ r, g, b });
export const colorObjectToArray = ({ r, g, b }: ColorObject): ColorArray => [r, g, b];

export function createFolderForObject<O extends Bindable, Key extends keyof O>(
  parent: FolderApi,
  title: string,
  object: O,
  keys: Key[]
): FolderApi {
  const folder = parent.addFolder({ title, expanded: false });
  keys.forEach((key) => {
    // Colors are all three.js colors, with components in the range [0.0, 1.0]
    const options = key === "color" ? { color: { type: "float" } } : undefined;
    folder.addInput(object, key, options);
  });
  return folder;
}
