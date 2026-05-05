import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";
import { latLngToVector3 } from "../../utils/math";
import Atmosphere from "./Atmosphere";

const GLOBE_RADIUS = 72;
const MARKER_RADIUS = GLOBE_RADIUS + 1.2;

/* ── Animated pulsing marker ──────────────────────── */
function Marker({ location, isActive, onSelect }) {
  const groupRef = useRef();
  const ringRef = useRef();
  const beamRef = useRef();
  const { lat, lng } = location.coordinates;
  const markerPosition = latLngToVector3(lat, lng, MARKER_RADIUS);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.elapsedTime;
    // Pulsing ring scale
    const pulse = 1 + 0.15 * Math.sin(t * 2.5 + lat);
    ringRef.current.scale.set(pulse, pulse, pulse);
    // Hover bob
    if (groupRef.current) {
      groupRef.current.position.copy(markerPosition);
      const bob = Math.sin(t * 1.8 + lng) * 0.3;
      groupRef.current.position.addScaledVector(
        markerPosition.clone().normalize(),
        bob,
      );
    }
    // Beam fade
    if (beamRef.current) {
      beamRef.current.material.opacity = isActive
        ? 0.15 + 0.1 * Math.sin(t * 3)
        : 0;
    }
  });

  // Orient marker to point outward from globe center
  const normal = markerPosition.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    normal,
  );

  return (
    <group ref={groupRef} position={markerPosition}>
      {/* Core sphere */}
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          const worldPos = new THREE.Vector3();
          event.object.getWorldPosition(worldPos);
          onSelect(location.id, worldPos);
        }}
      >
        <sphereGeometry args={[isActive ? 1.8 : 1.4, 20, 20]} />
        <meshStandardMaterial
          color={isActive ? "#d4aa70" : "#e8ddd0"}
          emissive={isActive ? "#a07840" : "#3a2e1f"}
          emissiveIntensity={isActive ? 1.2 : 0.3}
          toneMapped={false}
        />
      </mesh>
      {/* Outer glow sphere */}
      <mesh>
        <sphereGeometry args={[isActive ? 3.0 : 2.2, 16, 16]} />
        <meshBasicMaterial
          color={isActive ? "#d4aa70" : "#8a7a68"}
          transparent
          opacity={isActive ? 0.12 : 0.04}
          depthWrite={false}
        />
      </mesh>
      {/* Pulsing ring */}
      <group ref={ringRef} quaternion={quaternion}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[isActive ? 3.8 : 3.0, 0.12, 16, 48]} />
          <meshBasicMaterial
            color={isActive ? "#d4aa70" : "#6b5f4e"}
            transparent
            opacity={isActive ? 0.8 : 0.35}
          />
        </mesh>
        {/* Second ring */}
        {isActive && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[5.2, 0.06, 16, 48]} />
            <meshBasicMaterial color="#c8a060" transparent opacity={0.25} />
          </mesh>
        )}
      </group>
      {/* Light beam when active */}
      <mesh ref={beamRef} quaternion={quaternion}>
        <cylinderGeometry args={[0.3, 1.5, 18, 8, 1, true]} />
        <meshBasicMaterial
          color="#d4aa70"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ── Main Globe ───────────────────────────────────── */
export default function ToonGlobe({
  locations,
  selectedNodes,
  onSelect,
  resetSignal,
}) {
  const groupRef = useRef();

  const globe = useMemo(() => {
    const g = new ThreeGlobe();
    g.showGraticules(false);
    g.showAtmosphere(true);
    g.atmosphereColor("#60d0ff");
    g.atmosphereAltitude(0.18);

    // Soft 4-tone cel-shading gradient map (brighter base)
    const tones = new Uint8Array([100, 160, 210, 245]);
    const gradientMap = new THREE.DataTexture(
      tones,
      4,
      1,
      THREE.LuminanceFormat,
    );
    gradientMap.minFilter = THREE.NearestFilter;
    gradientMap.magFilter = THREE.NearestFilter;
    gradientMap.needsUpdate = true;

    // Load texture, posterize it on a canvas for a cartoon look, then apply
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = imageData.data;
      const levels = 10; // more levels = softer posterization
      const step = 256 / levels;

      for (let i = 0; i < px.length; i += 4) {
        // Posterize each channel
        let r = Math.round(px[i] / step) * step;
        let g2 = Math.round(px[i + 1] / step) * step;
        let b = Math.round(px[i + 2] / step) * step;

        // Lighten: lift shadows
        r = Math.min(255, r + 30);
        g2 = Math.min(255, g2 + 30);
        b = Math.min(255, b + 30);

        // Gentle saturation boost
        const gray = 0.299 * r + 0.587 * g2 + 0.114 * b;
        r = Math.min(255, Math.max(0, gray + (r - gray) * 1.25));
        g2 = Math.min(255, Math.max(0, gray + (g2 - gray) * 1.25));
        b = Math.min(255, Math.max(0, gray + (b - gray) * 1.25));

        px[i] = r;
        px[i + 1] = g2;
        px[i + 2] = b;
      }

      ctx.putImageData(imageData, 0, 0);

      const cartoonTex = new THREE.CanvasTexture(canvas);
      cartoonTex.colorSpace = THREE.SRGBColorSpace;

      const toonMat = new THREE.MeshToonMaterial({
        map: cartoonTex,
        gradientMap,
      });
      g.globeMaterial(toonMat);
    };
    img.src = "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

    return g;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (selectedNodes.length === 0) {
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  // Ensure globe starts showing the equator and center on Asia/Pacific
  useEffect(() => {
    if (!groupRef.current) return;
    // target longitude to center (east positive) — ~150°E shows Asia / Pacific
    const targetLat = 0;
    const targetLng = 150;
    const v = latLngToVector3(targetLat, targetLng, 100);
    // compute rotation.y so that the target vector faces the camera (positive Z)
    const ry = Math.atan2(-v.x, v.z);
    groupRef.current.rotation.x = Math.PI / 2;
    groupRef.current.rotation.y = ry;
  }, []);

  // Reset rotation to equator-facing Asia/Pacific when reset is triggered
  useEffect(() => {
    if (!resetSignal || !groupRef.current) return;
    const targetLat = 0;
    const targetLng = 150;
    const v = latLngToVector3(targetLat, targetLng, 100);
    const ry = Math.atan2(-v.x, v.z);
    groupRef.current.rotation.y = ry;
    groupRef.current.rotation.x = Math.PI / 2;
  }, [resetSignal]);

  return (
    <group ref={groupRef}>
      <group
        scale={[GLOBE_RADIUS / 100, GLOBE_RADIUS / 100, GLOBE_RADIUS / 100]}
      >
        <primitive object={globe} />
      </group>
      {/* Cartoon ink outline */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.6, 64, 64]} />
        <meshBasicMaterial color="#1a1410" side={THREE.BackSide} />
      </mesh>
      {/* Subtle inner edge highlight */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS - 0.2, 48, 48]} />
        <meshBasicMaterial
          color="#d4aa70"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </mesh>
      <Atmosphere radius={GLOBE_RADIUS} />
      {locations.map((location) => (
        <Marker
          key={location.id}
          location={location}
          isActive={selectedNodes.includes(location.id)}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
