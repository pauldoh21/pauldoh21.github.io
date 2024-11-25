import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function RotatingCube({ radius, angleOffset, color }) {
  const meshRef = React.useRef();

  // Set a random initial rotation
  const initialRotation = React.useMemo(() => ({
    x: Math.random() * Math.PI * 2,
    y: Math.random() * Math.PI * 2,
  }), []); // This memoizes the random values

  // Rotate the cube around the center point
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime(); // Get elapsed time
    const angle = (elapsed * 0.5) + angleOffset; // Add offset for unique positions
    const y = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const x = z + 0.2;

    // Update the cube's position and rotation
    if (meshRef.current) {
      meshRef.current.position.set(x, y, z);
      meshRef.current.rotation.y = initialRotation.y + elapsed * 0.5; // Add rotation
      meshRef.current.rotation.x = initialRotation.x + elapsed * 0.5; // Add rotation
    }
  });

  return (
    <mesh ref={meshRef} receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.5} />
    </mesh>
  );
}

function Sparkle({color}) {
  const meshRef = React.useRef();

   const randomPosition = () => (Math.random() - 0.5) * 10;
    const randomVelocity = () => (Math.random() - 0.5) * 5;

  // Generate random initial position and velocity
  const [position, velocity] = React.useMemo(() => {

    return [
      [randomPosition(), randomPosition(), randomPosition()-5],
      [randomVelocity(), randomVelocity(), randomVelocity()],
    ];
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime(); // Get elapsed time
    if (meshRef.current) {
      // Update sparkle position
      meshRef.current.position.x = position[0] + (velocity[0] * elapsed);
      meshRef.current.position.y = position[1] + (velocity[1] * elapsed);
      meshRef.current.position.z = position[2] + (velocity[2] * elapsed);

      // Wrap-around logic to keep sparkles within bounds
      const limit = 5;
      for (let i = 0; i < 3; i++) {
        if (meshRef.current.position.toArray()[i] > limit || meshRef.current.position.toArray()[i] < -limit) {
          meshRef.current.position.toArray()[i] = -meshRef.current.position.toArray()[i];
        }
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2}/>
    </mesh>
  );
}

function Background() {
  return (
    <div className="background">
      <Canvas
        camera={{ position: [0, 3, 10], fov: 50 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[32, 32]}
          color={'#aed1f5'}
        />
        <pointLight
            position={[0, -10, -.5]}
            intensity={30}
            color="orange"
        />

        {/* Rotating Cubes */}
        {[...Array(6)].map((_, index) => (
          <RotatingCube
            key={index}
            radius={3} // Distance from center
            angleOffset={(index * (Math.PI * 2)) / 6} // Distribute cubes evenly
            color='white'
          />
        ))}

        {/*{/* Sparkles *}
        {[...Array(30)].map((_, index) => (
          <Sparkle key={index} 
            color={index % 2 === 0 ? 'yellow' : 'orange'} // Alternate colors
          />
        ))}*/}
      </Canvas>
    </div>
  );
}

export default Background;
