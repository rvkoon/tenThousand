import { WebGLRenderer } from "three";

export function setRenderer(canvas) {
  return new WebGLRenderer({
    canvas,
  });
}
