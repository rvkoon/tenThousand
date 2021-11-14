import * as THREE from "three";

export default class LightFactory {
  generatePointLight({
    color = 0xffffff,
    intensity = 0.25,
    posX = 0,
    posY = 0,
    posZ = 0,
  }) {
    const pointLight = new THREE.PointLight(color, intensity);
    pointLight.position.set(posX, posY, posZ);
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 100;
    pointLight.shadow.radius = 10;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;

    return pointLight;
  }
}
