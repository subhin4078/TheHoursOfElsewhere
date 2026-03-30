import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
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
          onSelect(location.id, markerPosition);
        }}
      >
        <sphereGeometry args={[isActive ? 1.8 : 1.4, 20, 20]} />
        <meshStandardMaterial
          color={isActive ? "#67e8f9" : "#e0f2fe"}
          emissive={isActive ? "#06b6d4" : "#1e3a5f"}
          emissiveIntensity={isActive ? 1.2 : 0.3}
          toneMapped={false}
        />
      </mesh>
      {/* Outer glow sphere */}
      <mesh>
        <sphereGeometry args={[isActive ? 3.0 : 2.2, 16, 16]} />
        <meshBasicMaterial
          color={isActive ? "#22d3ee" : "#94a3b8"}
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
            color={isActive ? "#67e8f9" : "#64748b"}
            transparent
            opacity={isActive ? 0.8 : 0.35}
          />
        </mesh>
        {/* Second ring */}
        {isActive && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[5.2, 0.06, 16, 48]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.25} />
          </mesh>
        )}
      </group>
      {/* Light beam when active */}
      <mesh ref={beamRef} quaternion={quaternion}>
        <cylinderGeometry args={[0.3, 1.5, 18, 8, 1, true]} />
        <meshBasicMaterial
          color="#22d3ee"
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
export default function ToonGlobe({ locations, selectedNodes, onSelect }) {
  const groupRef = useRef();

  const globe = useMemo(() => {
    const g = new ThreeGlobe();
    g.showGraticules(true);
    g.showAtmosphere(true);
    g.atmosphereColor("#0ea5e9");
    g.atmosphereAltitude(0.18);

    const material = g.globeMaterial();
    if (material) {
      if (material.color) material.color = new THREE.Color("#0c1929");
      if (material.emissive) {
        material.emissive = new THREE.Color("#082f49");
        material.emissiveIntensity = 0.45;
      }
      material.shininess = 8;
    }

    return g;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={groupRef}>
      <group
        scale={[GLOBE_RADIUS / 100, GLOBE_RADIUS / 100, GLOBE_RADIUS / 100]}
      >
        <primitive object={globe} />
      </group>
      {/* Hex wireframe overlay */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.3, 64, 64]} />
        <meshBasicMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.04}
        />
      </mesh>
      {/* Subtle inner edge highlight */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS - 0.2, 48, 48]} />
        <meshBasicMaterial
          color="#0ea5e9"
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
