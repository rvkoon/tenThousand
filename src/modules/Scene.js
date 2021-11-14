import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import DiceFactory from "./DiceFactory";
import FloorFactory from "./FloorFactory";
import LightFactory from "./LightFactory";
import CANNON from "cannon";

/**
 * CONFIGURATION
 */
const CONFIG = {
  wWidth: window.innerWidth,
  wHeight: window.innerHeight,
  canvas: document.querySelector("canvas.webgl"),
  diceTextures: {},
  clock: new THREE.Clock(),
  oldElapsedTime: 0,
};

const DiceFact = new DiceFactory();
const FloorFact = new FloorFactory();
const LightFact = new LightFactory();

/**
 * Scene
 */
const Scene = new THREE.Scene();

/**
 * Physics
 */
const GameWorld = new CANNON.World();
GameWorld.gravity.set(0, -9.82, 0);
const DiceFloorContactMaterial = new CANNON.ContactMaterial(
  DiceFact.getDiceMaterial(),
  FloorFact.getFloorMaterial(),
  {
    friction: 0.1,
    restitution: 0.3,
  }
);
GameWorld.addContactMaterial(DiceFloorContactMaterial);

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
const floor = FloorFact.generateFloor();
Scene.add(floor);
const floorBody = FloorFact.generateFloorMaterial();
GameWorld.addBody(floorBody);

//Dice 1
const dice1 = DiceFact.generateDice();
dice1.position.set(3, 4, 3);
dice1.rotation.set(0.5, 0.5, 0.5);
Scene.add(dice1);

const dice1Body = DiceFact.generateDiceMaterial();
dice1Body.applyLocalForce(
  new CANNON.Vec3(500, -100, 0),
  new CANNON.Vec3(0, 0, 0)
);
GameWorld.addBody(dice1Body);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
Scene.add(ambientLight);

const pointLight1 = LightFact.generatePointLight({
  posX: 6,
  posY: 6,
  posZ: 6,
});
Scene.add(pointLight1);
const pointLight2 = LightFact.generatePointLight({
  posX: -6,
  posY: 6,
  posZ: -6,
});
Scene.add(pointLight2);
const pointLight3 = LightFact.generatePointLight({
  posX: -6,
  posY: 6,
  posZ: 6,
});
Scene.add(pointLight3);
const pointLight4 = LightFact.generatePointLight({
  posX: 6,
  posY: 6,
  posZ: -6,
});
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
Camera.position.set(20, 20, 20);
Camera.lookAt(0, 0, 0);

const controls = new OrbitControls(Camera, renderer.domElement);

/**
 * Functions
 */
export function tick() {
  const elapsedTime = CONFIG.clock.getElapsedTime();
  const deltaTime = elapsedTime - CONFIG.oldElapsedTime;
  CONFIG.oldElapsedTime = elapsedTime;

  const windowSizeHasChanged =
    CONFIG.wWidth !== window.innerWidth ||
    CONFIG.wHeight !== window.innerHeight;

  if (windowSizeHasChanged) {
    CONFIG.wWidth = window.innerWidth;
    CONFIG.wHeight = window.innerHeight;
    renderer.setSize(CONFIG.wWidth, CONFIG.wHeight);
  }

  GameWorld.step(1 / 60, deltaTime, 3);
  dice1.position.copy(dice1Body.position);
  renderer.render(Scene, Camera);
  requestAnimationFrame(tick);
}
