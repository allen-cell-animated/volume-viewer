import { Bindable, FolderApi } from "@tweakpane/core";

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
