import * as THREE from "three";

const CONF = {
  lightColor: 0xff0000,
};

export function createAmbientLight(color = lightColor) {
  return new THREE.AmbientLight(color);
}
