declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.obj" {
  const value: string;
  export default value;
}

declare module "*?raw" {
  const content: string;
  export default content;
}
declare module "*?worker&url" {
  const content: string;
  export default content;
}
