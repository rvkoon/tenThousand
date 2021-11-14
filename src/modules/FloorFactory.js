import * as THREE from "three";
import CANNON from "cannon";

export default class FloorFactory {
  floorMaterial = new CANNON.Material("floorMaterial");

  generateFloor() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({
        color: "#558e59",
        roughness: 1,
        metalness: 0,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.castShadow = true;
    floor.receiveShadow = true;

    return floor;
  }

  generateFloorMaterial() {
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    floorBody.addShape(floorShape);
    floorBody.material = this.floorMaterial;
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    return floorBody;
  }

  getFloorMaterial() {
    return this.floorMaterial;
  }
}
