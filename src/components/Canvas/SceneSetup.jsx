import { OrbitControls, Stars } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect } from "react";

export default function SceneSetup({ focusTarget }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!focusTarget) return;

    const destination = focusTarget.clone().normalize().multiplyScalar(170);

    gsap.to(camera.position, {
      x: destination.x,
      y: destination.y,
      z: destination.z,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => camera.lookAt(0, 0, 0),
    });
  }, [camera, focusTarget]);

  return (
    <>
      <ambientLight intensity={0.25} color="#b8e0ff" />
      <directionalLight
        intensity={0.9}
        position={[200, 180, 150]}
        color="#f0f8ff"
      />
      <directionalLight
        intensity={0.25}
        position={[-150, -80, -100]}
        color="#0ea5e9"
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={0.15}
        color="#22d3ee"
        distance={200}
      />
      <fog attach="fog" args={["#000000", 350, 600]} />
      <Stars
        radius={400}
        depth={120}
        count={4000}
        factor={2.8}
        saturation={0.1}
        fade
        speed={0.2}
      />
      <OrbitControls
        enablePan={false}
        minDistance={120}
        maxDistance={300}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />
    </>
  );
}
