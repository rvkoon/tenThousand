import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Dice from "./Dice";

/**
 * CONFIGURATION
 */
const CONFIG = {
  wWidth: window.innerWidth,
  wHeight: window.innerHeight,
  canvas: document.querySelector("canvas.webgl"),
  diceTextures: {},
};

/**
 * Loader manager
 */
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
for (let i = 1; i < 7; i++) {
  CONFIG.diceTextures[`dice${i}`] = textureLoader.load(
    `/textures/diceFaces/dice_${i}.jpeg`
  );
}

setTimeout(() => {
  console.log(CONFIG);
}, 5000);

/**
 * Scene
 */
const Scene = new THREE.Scene();

/**
 * Meshes
 */
//Sky
const vertexShader = document.getElementById("vertexShader").textContent;
const fragmentShader = document.getElementById("fragmentShader").textContent;
const uniforms = {
  topColor: { value: new THREE.Color("#9db1f2") },
  bottomColor: { value: new THREE.Color(0xffffff) },
  offset: { value: 400 },
  exponent: { value: 0.6 },
};
const skyGeo = new THREE.SphereGeometry(30, 32, 15);
const skyMat = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.BackSide,
});

const sky = new THREE.Mesh(skyGeo, skyMat);
Scene.add(sky);

//Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 24),
  new THREE.MeshStandardMaterial({
    color: "#558e59",
    roughness: 1,
    metalness: 0,
  })
);
floor.rotation.x = -Math.PI / 2;
floor.castShadow = true;
floor.receiveShadow = true;
Scene.add(floor);

//Dice 1
const dice1 = new Dice({
  color: 0xffffff,
});
dice1.setDicePosition({
  posX: 4,
  posY: 0.5,
  posZ: 4,
});
Scene.add(dice1.getDice());

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
Scene.add(ambientLight);

const pointLight1 = new THREE.PointLight("#ffffff", 0.25);
pointLight1.position.set(6, 6, 6);
pointLight1.castShadow = true;
pointLight1.shadow.camera.near = 0.5;
pointLight1.shadow.camera.far = 100;
pointLight1.shadow.radius = 10;
pointLight1.shadow.mapSize.width = 1024;
pointLight1.shadow.mapSize.height = 1024;
Scene.add(pointLight1);

const pointLight2 = new THREE.PointLight("#ffffff", 0.25);
pointLight2.position.set(-6, 6, -6);
pointLight2.castShadow = true;
pointLight2.shadow.camera.near = 0.5;
pointLight2.shadow.camera.far = 100;
pointLight2.shadow.radius = 10;
pointLight2.shadow.mapSize.width = 1024;
pointLight2.shadow.mapSize.height = 1024;
Scene.add(pointLight2);

const pointLight3 = new THREE.PointLight("#ffffff", 0.25);
pointLight3.position.set(-6, 6, 6);
pointLight3.castShadow = true;
pointLight3.shadow.camera.near = 0.5;
pointLight3.shadow.camera.far = 100;
pointLight3.shadow.radius = 10;
pointLight3.shadow.mapSize.width = 1024;
pointLight3.shadow.mapSize.height = 1024;
Scene.add(pointLight3);

const pointLight4 = new THREE.PointLight("#ffffff", 0.25);
pointLight4.position.set(6, 6, -6);
pointLight4.castShadow = true;
pointLight4.shadow.camera.near = 0.5;
pointLight4.shadow.camera.far = 100;
pointLight4.shadow.radius = 10;
pointLight4.shadow.mapSize.width = 1024;
pointLight4.shadow.mapSize.height = 1024;
Scene.add(pointLight4);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: CONFIG.canvas,
});
renderer.setSize(CONFIG.wWidth, CONFIG.wHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Camera
 */
const Camera = new THREE.PerspectiveCamera(
  50,
  CONFIG.wWidth / CONFIG.wHeight,
  0.1,
  1000
);
Camera.position.set(6, 6, 6);
Camera.lookAt(0, 0, 0);

const controls = new OrbitControls(Camera, renderer.domElement);

/**
 * Functions
 */
export function tick() {
  const windowSizeHasChanged =
    CONFIG.wWidth !== window.innerWidth ||
    CONFIG.wHeight !== window.innerHeight;

  if (windowSizeHasChanged) {
    CONFIG.wWidth = window.innerWidth;
    CONFIG.wHeight = window.innerHeight;
    renderer.setSize(CONFIG.wWidth, CONFIG.wHeight);
  }

  renderer.render(Scene, Camera);
  requestAnimationFrame(tick);
}
