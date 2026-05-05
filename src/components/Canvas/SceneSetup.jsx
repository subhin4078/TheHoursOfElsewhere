import { OrbitControls, Stars } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import { getSunPosition } from "../../utils/solar";

export default function SceneSetup({ focusTarget, resetSignal }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  // Sun position drives the main directional light — computed once on mount
  const sunPos = useMemo(() => getSunPosition(300), []);

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
      <ambientLight intensity={1.5} color="#d8dce8" />

      {/* Main sunlight */}
      <directionalLight
        intensity={5.0}
        position={[sunPos.x, sunPos.y, sunPos.z]}
        color="#fff8e8"
      />

      {/* Night-side fill */}
      <directionalLight
        intensity={1.5}
        position={[-sunPos.x * 0.6, -sunPos.y * 0.6, -sunPos.z * 0.6]}
        color="#4a5a7a"
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
