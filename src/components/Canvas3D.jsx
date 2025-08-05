import { Canvas } from "@react-three/fiber";
import { useGLTF, Decal, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import modelGltf from "/src/assets/3d/tshirt.glb";

const TshirtModel = ({ textureUrl }) => {
  const { nodes, materials } = useGLTF(modelGltf);
  const texture = useRef();

  useEffect(() => {
    if (!textureUrl) return;
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      texture.current = tex;
    });
  }, [textureUrl]);

  return (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.tshirt.geometry}
      material={materials.color}
      scale={6}
    >
      {texture.current && (
        <Decal
          map={texture.current}
          position={[0, 0.1, 0.13]}
          rotation={[0, 0, 0]}
          scale={0.12}
        />
      )}
    </mesh>
  );
};

const Canvas3D = ({ textureUrl }) => {
  return (
    <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 2, 2]} intensity={1} />
      <OrbitControls />
      <TshirtModel textureUrl={textureUrl} />
    </Canvas>
  );
};

export default Canvas3D;
