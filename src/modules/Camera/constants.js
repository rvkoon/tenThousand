import {
  ArrayCamera,
  Camera,
  CubeCamera,
  OrthographicCamera,
  PerspectiveCamera,
  StereoCamera,
} from "three";

const CAMERA = {};
CAMERA.TYPES = {};
CAMERA.TYPES.ARRAY_CAMERA = ArrayCamera;
CAMERA.TYPES.CAMERA = Camera;
CAMERA.TYPES.CUBE_CAMERA = CubeCamera;
CAMERA.TYPES.ORTHOGRAPHIC_CAMERA = OrthographicCamera;
CAMERA.TYPES.PERSPECTIVE_CAMERA = PerspectiveCamera;
CAMERA.TYPES.STEREO_CAMERA = StereoCamera;

export default CAMERA;
