import React, { useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useFrame } from '@react-three/fiber';

const colours = [
    "blue",
    "red",
    "green"
]

function randomColour() {
    return colours[Math.floor(Math.random() * colours.length)];
}


const RotatingPlane = () => {
    const image = useLoader(TextureLoader, '/logo.png')

    const [colour, setColour] = React.useState(colours[0]);

    const handleChangedColour = () => {
        console.log("yo")
        const newColour = randomColour;
        setColour(newColour);
    };

    const planeRef = useRef();

    useFrame(() => {
        planeRef.current.rotation.x += 0.01;
        planeRef.current.rotation.y += 0.01;
    });

    return (
    <>
        <mesh onClick={handleChangedColour}>
            <planeGeometry attach="geometry" args={[5, 5]} />
            <meshBasicMaterial
                map={image}
                transparent={true}
                attach="material"
                toneMapped={false}
            />
        </mesh>
        <mesh ref={planeRef} position={[1, 1, 1]} rotation={[0, 0, 0]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color={colour} />
        </mesh>
    </>
  );
};

const AnimatedPlane = () => {

  return (
    <div style={{
        width:"50vw", 
        height:"50vh", 
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid red',
        margin: "0 auto", // Center horizontally
        position: "absolute", // Center in both directions
        top: "50%", 
        left: "50%",
        transform: "translate(-50%, -50%)",
        }}
    >
        <Canvas 
        style={{
            width: "80%", // Ensures Canvas scales to parent width
            height: "80%", // Ensures Canvas scales to parent height
            border: '2px solid red',
          }}
        flat linear>
            <ambientLight />
            <RotatingPlane />
        </Canvas>
    </div>
  );
};

export default AnimatedPlane;
