import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const MOON_RADIUS = 12;
const MOON_ORBIT_RADIUS = 180; // visual distance from Earth center

/**
 * Simplified lunar ephemeris — returns ecliptic longitude, latitude
 * based on mean orbital elements from J2000.0
 */
function getMoonPosition(date) {
  const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const d = (date.getTime() - J2000) / 86_400_000;

  const rad = Math.PI / 180;

  // Mean longitude (deg)
  const L0 = (218.316 + 13.176396 * d) % 360;
  // Mean anomaly (deg)
  const M = ((134.963 + 13.064993 * d) % 360) * rad;
  // Mean distance argument (deg)
  const F = ((93.272 + 13.22935 * d) % 360) * rad;

  // Ecliptic longitude with first-order correction
  const lon = ((L0 + 6.289 * Math.sin(M)) % 360) * rad;
  // Ecliptic latitude
  const lat = 5.128 * Math.sin(F) * rad;

  // Convert to Cartesian (Y-up for Three.js)
  const x = MOON_ORBIT_RADIUS * Math.cos(lat) * Math.cos(lon);
  const y = MOON_ORBIT_RADIUS * Math.sin(lat);
  const z = MOON_ORBIT_RADIUS * Math.cos(lat) * Math.sin(lon);

  return new THREE.Vector3(x, y, z);
}

export default function Moon() {
  const groupRef = useRef();

  // Gradient map for toon shading
  const gradientMap = useMemo(() => {
    const tones = new Uint8Array([80, 150, 210, 245]);
    const tex = new THREE.DataTexture(tones, 4, 1, THREE.LuminanceFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Generate a procedural moon-like texture on a canvas
  const moonTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Base gray
    ctx.fillStyle = "#c8c4be";
    ctx.fillRect(0, 0, size, size);

    // Draw random craters
    const rng = (seed) => {
      let s = seed;
      return () => {
        s = (s * 16807 + 0) % 2147483647;
        return s / 2147483647;
      };
    };
    const rand = rng(42);

    for (let i = 0; i < 60; i++) {
      const cx = rand() * size;
      const cy = rand() * size;
      const r = 4 + rand() * 24;
      const brightness = 160 + Math.floor(rand() * 40) - 20;

      // Crater shadow
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${brightness - 30}, ${brightness - 32}, ${brightness - 35})`;
      ctx.fill();

      // Crater highlight rim
      ctx.beginPath();
      ctx.arc(cx - r * 0.15, cy - r * 0.15, r * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${brightness + 10}, ${brightness + 8}, ${brightness + 5})`;
      ctx.fill();
    }

    // Some larger maria (dark patches)
    for (let i = 0; i < 8; i++) {
      const cx = rand() * size;
      const cy = rand() * size;
      const r = 30 + rand() * 60;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 98, 92, ${0.15 + rand() * 0.15})`;
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Set initial position immediately
  const initialPos = useMemo(() => getMoonPosition(new Date()), []);

  // Update moon position every frame based on real time
  useFrame(() => {
    if (!groupRef.current) return;
    const pos = getMoonPosition(new Date());
    groupRef.current.position.copy(pos);
  });

  // Derive the orbital plane from two sampled Moon positions
  const orbitQuat = useMemo(() => {
    const now = new Date();
    const later = new Date(now.getTime() + 7 * 86_400_000); // ~1 week later
    const p1 = getMoonPosition(now);
    const p2 = getMoonPosition(later);
    // Normal to the orbital plane = cross product of two position vectors
    const normal = new THREE.Vector3().crossVectors(p1, p2).normalize();
    // Torus default normal is Z-axis; rotate Z to the computed normal
    return new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      normal,
    );
  }, []);

  return (
    <>
      {/* Faint orbit ring aligned to Moon's orbital plane */}
      <mesh quaternion={orbitQuat}>
        <torusGeometry args={[MOON_ORBIT_RADIUS, 0.15, 16, 128]} />
        <meshBasicMaterial
          color="#94a3b8"
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
      <group ref={groupRef} position={initialPos}>
        {/* Moon body */}
        <mesh>
          <sphereGeometry args={[MOON_RADIUS, 32, 32]} />
          <meshToonMaterial
            map={moonTexture}
            color="#e8e4df"
            gradientMap={gradientMap}
          />
        </mesh>
        {/* Subtle glow */}
        <mesh>
          <sphereGeometry args={[MOON_RADIUS + 2, 24, 24]} />
          <meshBasicMaterial
            color="#f5f0e8"
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
        {/* Outer glow halo */}
        <mesh>
          <sphereGeometry args={[MOON_RADIUS + 5, 16, 16]} />
          <meshBasicMaterial
            color="#fffbe6"
            transparent
            opacity={0.03}
            depthWrite={false}
          />
        </mesh>
      </group>
    </>
  );
}
