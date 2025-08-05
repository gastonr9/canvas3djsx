import { Canvas, useFrame, useLoader,  } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'



function TshirtModel() {
   const gltf = useLoader(GLTFLoader, '/tshirt.glb')
  const overlayTexture = useLoader(THREE.TextureLoader, '/tshirt.png');
  overlayTexture.flipY = false;

  const groupRef = useRef();

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
      });

      const overlayMaterial = new THREE.MeshBasicMaterial({
        map: overlayTexture,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
      });

      const baseMesh = new THREE.Mesh(child.geometry.clone(), baseMaterial);
      const overlayMesh = new THREE.Mesh(child.geometry.clone(), overlayMaterial);

      const group = new THREE.Group();
      group.add(baseMesh);
      group.add(overlayMesh);
      child.parent.add(group);
      child.visible = false;
    }
  });

  return <primitive object={gltf.scene} ref={groupRef} />;
}

function AnimatedLight() {
  const lightRef = useRef();
  useFrame(() => {
    const time = Date.now() * 0.0005;
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(time * 0.7) * 20;
      lightRef.current.position.z = Math.abs(Math.cos(time * 0.7)) * 20;
    }
  });
  return <directionalLight ref={lightRef} intensity={1} position={[20, 20, 20]} />;
}

export default function TshirtScene() {
  return (
    <div id="canvas-container">
    <Canvas camera={{ position: [0, 0, 1], fov: 50 }} style={{background:"blue",height:"100vh"}}>
      <ambientLight intensity={0.5} />
      <AnimatedLight />
      <OrbitControls enableDamping />
      <Suspense fallback={null}>
        <TshirtModel />
        <Environment preset="city" />
      </Suspense>
    </Canvas></div>
  );
}
