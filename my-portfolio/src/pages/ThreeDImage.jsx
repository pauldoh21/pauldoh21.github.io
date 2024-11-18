import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three'; // Import TextureLoader from three.js

const ThreeDImage = () => {
  const meshRef = useRef();
  
  // Load the custom image texture (from the 'public' folder in this case)
  const texture = useLoader(TextureLoader, '/logo.png'); // Path to your image file
  
  // Animation for moving and rotating the image
  const { position, rotation } = useSpring({
    position: [window.location.pathname === '/' ? 0 : -2, 0, 0], // Move left after homepage
    rotation: [0, window.location.pathname === '/' ? 0 : Math.PI / 4, 0], // Slight rotation
    config: { mass: 1, tension: 170, friction: 26 },
  });

  return (
    <Canvas style={{ height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0 }}>
      <ambientLight intensity={0.5} />
      {/* 3D object with texture applied */}
      <animated.mesh ref={meshRef} position={position} rotation={rotation}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={texture} /> {/* Apply the image texture */}
      </animated.mesh>
    </Canvas>
  );
};

export default ThreeDImage;
