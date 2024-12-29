// Allows GLSL shader file import to be recognized as
// strings by typescript compiler
declare module "*.glsl" {
  const value: string;
  export default value;
}

declare module "*.frag?raw" {
  const value: string;
  export default value;
}

declare module "*.vert?raw" {
  const value: string;
  export default value;
}

declare module "*.fs" {
  const value: string;
  export default value;
}

declare module "*.vs" {
  const value: string;
  export default value;
}
