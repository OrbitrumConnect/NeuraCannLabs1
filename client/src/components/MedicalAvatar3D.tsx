import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface MedicalAvatar3DProps {
  isActive?: boolean;
  isListening?: boolean;
  message?: string;
  className?: string;
}

export default function MedicalAvatar3D({ 
  isActive = false, 
  isListening = false, 
  message = '', 
  className = '' 
}: MedicalAvatar3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      1, // Square aspect ratio for container
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 2.5);
    camera.lookAt(0, 1.6, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(48, 48);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 4, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Medical professional lighting (cool blue-white)
    const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.3);
    fillLight.position.set(-2, 2, 1);
    scene.add(fillLight);

    // Load medical avatar
    const loader = new GLTFLoader();
    
    // Using a professional medical avatar model
    // In production, you'd host your own medical professional model
    const avatarUrl = 'https://threejs.org/examples/models/gltf/Xbot.glb';
    
    loader.load(
      avatarUrl,
      (gltf) => {
        const model = gltf.scene;
        model.scale.setScalar(1.2);
        model.position.set(0, 0, 0);
        
        // Add medical coat material (white lab coat effect)
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Make it look more professional/medical
            if (child.material) {
              const material = child.material as THREE.MeshStandardMaterial;
              material.metalness = 0.1;
              material.roughness = 0.8;
            }
          }
        });

        scene.add(model);

        // Animation mixer
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;

        // Default idle animation
        if (gltf.animations.length > 0) {
          const idleAction = mixer.clipAction(gltf.animations[0]);
          idleAction.timeScale = 0.5; // Slower, more professional movement
          idleAction.play();
        }

        setIsLoaded(true);
      },
      undefined,
      (error) => {
        console.error('Erro ao carregar avatar médico:', error);
        setIsLoaded(true); // Still show fallback
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clockRef.current.getDelta();
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Subtle head movement when active
      if (isActive && sceneRef.current) {
        const time = clockRef.current.getElapsedTime();
        camera.position.x = Math.sin(time * 0.5) * 0.1;
        camera.lookAt(0, 1.6, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, []);

  // Handle state changes
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current) return;

    // Change lighting based on activity state
    const scene = sceneRef.current;
    const lights = scene.children.filter(child => child instanceof THREE.Light);
    
    if (isListening) {
      // Bright cyan glow when listening
      lights.forEach(light => {
        if (light instanceof THREE.DirectionalLight) {
          light.color.setHex(0x00ffff);
        }
      });
    } else if (isActive) {
      // Soft medical blue when active
      lights.forEach(light => {
        if (light instanceof THREE.DirectionalLight) {
          light.color.setHex(0x87CEEB);
        }
      });
    } else {
      // Normal white light when idle
      lights.forEach(light => {
        if (light instanceof THREE.DirectionalLight) {
          light.color.setHex(0xffffff);
        }
      });
    }
  }, [isActive, isListening]);

  return (
    <div className={`relative ${className}`}>
      {/* 3D Avatar Container */}
      <div 
        ref={mountRef} 
        className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300 ${
          isActive 
            ? 'border-neon-cyan shadow-lg shadow-neon-cyan/30' 
            : 'border-gray-600'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(0,20,40,0.8) 0%, rgba(0,0,0,0.9) 100%)'
        }}
      />

      {/* Status Indicators */}
      {isListening && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-neon-cyan rounded-full animate-pulse" />
      )}
      
      {isActive && !isListening && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
      )}

      {/* Medical Badge */}
      <div className="absolute -bottom-1 -right-1 bg-white/90 rounded-full p-0.5">
        <div className="w-3 h-3 flex items-center justify-center">
          <i className="fas fa-user-md text-blue-600 text-[8px]" />
        </div>
      </div>

      {/* Speech Indicator */}
      {message && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap max-w-24 truncate">
          {message}
        </div>
      )}

      {/* Loading Fallback */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-full">
          <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}