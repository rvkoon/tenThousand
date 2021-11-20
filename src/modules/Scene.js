import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import DiceFactory from "./DiceFactory";
import FloorFactory from "./FloorFactory";
import LightFactory from "./LightFactory";
import CANNON from "cannon";

const DiceFact = new DiceFactory();
const FloorFact = new FloorFactory();
const LightFact = new LightFactory();

const CONFIG = {
  wWidth: window.innerWidth,
  wHeight: window.innerHeight,
  canvas: document.querySelector("canvas.webgl"),
  diceTextures: {},
  clock: new THREE.Clock(),
  oldElapsedTime: 0,
};

const DICES = [];

const rollButton = document.querySelector("button.rollDicesButton");

function getRandomNum(min, max) {
  return Math.random() * (max - min) + min;
}

const Scene = new THREE.Scene();

/**
 * Physics
 */
const GameWorld = new CANNON.World();
GameWorld.gravity.set(0, -9.82 * 10, 0);
const DiceFloorContactMaterial = new CANNON.ContactMaterial(
  DiceFact.getDiceMaterial(),
  FloorFact.getFloorMaterial(),
  {
    friction: 0.1,
    restitution: 0.5,
  }
);
GameWorld.addContactMaterial(DiceFloorContactMaterial);
const DicesContactMaterial = new CANNON.ContactMaterial(
  DiceFact.getDiceMaterial(),
  DiceFact.getDiceMaterial(),
  {
    friction: 0,
    restitution: 0.5,
  }
);
GameWorld.addContactMaterial(DicesContactMaterial);

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
const skyGeo = new THREE.SphereGeometry(60, 32, 15);
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

//Dices
for (let i = 0; i < 1; i++) {
  const setDice = {
    x: i,
    y: 0.5,
    z: i,
  };

  const dice = DiceFact.generateDice();
  dice.position.set(setDice.x, setDice.y, setDice.z);

  const diceBody = DiceFact.generateDiceMaterial();
  (diceBody.position = new CANNON.Vec3(setDice.x, setDice.y, setDice.z)),
    GameWorld.addBody(diceBody);

  DICES.push({
    mesh: dice,
    body: diceBody,
  });
}

rollButton.addEventListener("click", () => {
  let i = 0;

  DICES.forEach((dice) => Scene.remove(dice.mesh));

  const throwDicesInterval = setInterval(() => {
    if (i === 1) {
      return clearInterval(throwDicesInterval);
    }

    Scene.add(DICES[i].mesh);
    console.log(DICES[i]);

    getUpsideValue(DICES[i]);

    const diceBody = DICES[i].body;
    const setDice = {
      x: 10,
      y: getRandomNum(1, 4),
      z: getRandomNum(-1, 1),
    };
    diceBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 1, 1), Math.PI / 6);
    diceBody.applyLocalForce(
      new CANNON.Vec3(-50, 0, 0),
      new CANNON.Vec3(0, 0, 0)
    );
    (diceBody.position = new CANNON.Vec3(setDice.x, setDice.y, setDice.z)),
      diceBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 1, 1),
        Math.PI / 6
      );
    i++;
  }, 50);
});

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

function getUpsideValue(obj) {
  let vector = new THREE.Vector3(0, 1);
  let closest_face;
  let closest_angle = Math.PI * 2;

  let normals = obj.mesh.geometry.getAttribute("normal").array;
  for (let i = 0; i < obj.mesh.geometry.groups.length; ++i) {
    let face = obj.mesh.geometry.groups[i];
    if (face.materialIndex === 0) continue;

    let startVertex = i * 12;
    let normal = new THREE.Vector3(
      normals[startVertex],
      normals[startVertex + 1],
      normals[startVertex + 2]
    );
    let angle = normal
      .clone()
      .applyQuaternion(obj.body.quaternion)
      .angleTo(vector);
    if (angle < closest_angle) {
      closest_angle = angle;
      closest_face = face;
    }
  }

  return closest_face.materialIndex + 1;
}

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

  DICES.forEach((object) => {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  });

  renderer.render(Scene, Camera);
  requestAnimationFrame(tick);
}
