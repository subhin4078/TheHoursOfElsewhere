import { OrbitControls, Stars } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function SceneSetup({ focusTarget, resetSignal }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (!resetSignal) return;
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 300,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, 0);
      },
      onComplete: () => {
        camera.up.set(0, 1, 0);
        camera.position.set(0, 0, 300);
        camera.lookAt(0, 0, 0);
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }
      },
    });
  }, [camera, resetSignal]);

  useEffect(() => {
    if (!focusTarget) return;
    // ignore zero-vector focusTarget (used for reset) to avoid moving camera to origin
    if (focusTarget.length && focusTarget.length() === 0) return;

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
      <ambientLight intensity={1.8} color="#ffffff" />
      <directionalLight
        intensity={2.2}
        position={[200, 180, 150]}
        color="#ffffff"
      />
      <directionalLight
        intensity={0.8}
        position={[-150, -80, -100]}
        color="#cce8ff"
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={0.15}
        color="#22d3ee"
        distance={200}
      />
      <fog attach="fog" args={["#000000", 500, 900]} />
      <Stars
        radius={350}
        depth={80}
        count={6000}
        factor={12}
        saturation={0.3}
        fade
        speed={0.3}
      />
      <OrbitControls
        ref={controlsRef}
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
