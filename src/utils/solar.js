import * as THREE from "three";

/**
 * Returns a fixed, aesthetically good sun position.
 * Upper-right, slightly in front of the camera (negative Z in Three.js
 * when camera is at +Z looking at origin).
 * @param {number} distance  Distance from origin (scene units)
 */
export function getSunPosition(distance = 520) {
  // Azimuth: 35° to the right of the camera axis (positive X)
  // Elevation: 30° above the equator (positive Y)
  // Depth: slightly in front (negative Z, toward camera)
  const azimuthRad = (35 * Math.PI) / 180;
  const elevationRad = (30 * Math.PI) / 180;

  return new THREE.Vector3(
    distance * Math.sin(azimuthRad) * Math.cos(elevationRad), //  x: right
    distance * Math.sin(elevationRad), //  y: up
    -distance * Math.cos(azimuthRad) * Math.cos(elevationRad), // z: toward camera
  );
}
