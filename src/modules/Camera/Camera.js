import * as THREE from "three";

function generateCamera(cameraType) {
  return function (fov, ratio, near, far) {
    return new cameraType(fov, ratio, near, far);
  };
}

export default {
  generateCamera,
};
