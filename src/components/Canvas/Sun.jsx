import { useMemo } from "react";
import * as THREE from "three";

const SUN_DISTANCE = 520;

/**
 * Simplified solar position — sun orbits based on UTC hour and day of year.
 * Gives a plausible sky position for the 3D scene.
 */
function getSunPosition() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / 86_400_000);
  const hourUTC = now.getUTCHours() + now.getUTCMinutes() / 60;

  // Hour angle: noon UTC = front of scene (positive Z)
  const hourAngle = ((hourUTC / 24) * Math.PI * 2 - Math.PI) * -1;
  // Declination: axial tilt ±23.5°
  const declination =
    ((23.5 * Math.PI) / 180) * Math.sin(((dayOfYear - 80) / 365) * Math.PI * 2);

  return new THREE.Vector3(
    SUN_DISTANCE * Math.cos(declination) * Math.sin(hourAngle),
    SUN_DISTANCE * Math.sin(declination),
    SUN_DISTANCE * Math.cos(declination) * Math.cos(hourAngle),
  );
}

function makeGlowSprite(innerColor, outerColor) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const half = size / 2;

  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, innerColor);
  grad.addColorStop(0.25, outerColor);
  grad.addColorStop(0.7, "rgba(255,200,80,0.05)");
  grad.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

export default function Sun() {
  const sunPos = useMemo(() => getSunPosition(), []);

  const coronaTexture = useMemo(
    () => makeGlowSprite("rgba(255,252,220,1)", "rgba(255,200,80,0.7)"),
    [],
  );
  const haloTexture = useMemo(
    () => makeGlowSprite("rgba(255,180,60,0.4)", "rgba(255,140,40,0.0)"),
    [],
  );

  return (
    <group position={sunPos}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[16, 32, 32]} />
        <meshBasicMaterial color="#fffce8" />
      </mesh>

      {/* Corona glow — tight */}
      <sprite scale={[130, 130, 1]}>
        <spriteMaterial
          map={coronaTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* Outer halo — soft, wide */}
      <sprite scale={[380, 380, 1]}>
        <spriteMaterial
          map={haloTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.65}
        />
      </sprite>
    </group>
  );
}
