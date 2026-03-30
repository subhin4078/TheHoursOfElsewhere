import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const FresnelGlowMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#22d3ee"),
    uIntensity: 1.0,
  },
  /* vertex */ `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uIntensity;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = 1.0 - dot(viewDir, vNormal);
      fresnel = pow(fresnel, 3.0);
      float pulse = 0.85 + 0.15 * sin(uTime * 0.8);
      float alpha = fresnel * uIntensity * pulse;
      gl_FragColor = vec4(uColor, alpha * 0.6);
    }
  `,
);

extend({ FresnelGlowMaterial });

export default function Atmosphere({ radius = 72 }) {
  const matRef = useRef();

  useFrame((state) => {
    if (matRef.current) matRef.current.uTime = state.clock.elapsedTime;
  });

  return (
    <group>
      {/* Inner soft glow */}
      <mesh>
        <sphereGeometry args={[radius + 3, 64, 64]} />
        <fresnelGlowMaterial
          ref={matRef}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          uColor={new THREE.Color("#22d3ee")}
          uIntensity={1.2}
        />
      </mesh>
      {/* Outer diffuse halo */}
      <mesh>
        <sphereGeometry args={[radius + 8, 64, 64]} />
        <fresnelGlowMaterial
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          uColor={new THREE.Color("#0ea5e9")}
          uIntensity={0.4}
        />
      </mesh>
    </group>
  );
}
