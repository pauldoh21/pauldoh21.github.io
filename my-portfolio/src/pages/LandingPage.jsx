import React, { useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';

const ClickableImage = ({ onComplete }) => {
  const image = useLoader(TextureLoader, '/logo.png')
  const imageRef = React.useRef();
  const [clicked, setClicked] = React.useState(false);

  // Rotation and position updates
  useFrame(() => {
    if (imageRef.current) {
      if (clicked) {
        imageRef.current.rotation.y += 0.01; // Rotate slightly during animation
      }
    }
  });

  const handleClick = () => {
    setClicked(true);
    setTimeout(onComplete, 1000); // Trigger scene change after animation
  };

  return (
    <motion.group
      animate={{
        position: clicked ? [-2, 0, 0] : [0, 0, 0], // Move to the left
        rotation: clicked ? [0, Math.PI / 4, 0] : [0, 0, 0], // Slight rotation
      }}
      transition={{ duration: 1 }}
      onClick={handleClick}
    >
      <mesh ref={imageRef}>
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial map={image} color="white" />
      </mesh>
    </motion.group>
  );
};

const LandingPage = ({ onComplete }) => {
  return (
    <div style={{ height: '100vh', background: '#121212' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <ClickableImage onComplete={onComplete} />
      </Canvas>
    </div>
  );
};

export default LandingPage;
  