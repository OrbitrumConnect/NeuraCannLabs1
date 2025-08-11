import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useScan } from "@/contexts/ScanContext";

interface MedicalAvatar3DProps {
  isActive?: boolean;
  isListening?: boolean;
  message?: string;
  className?: string;
  isScanning?: boolean;
}

export default function MedicalAvatar3D({ 
  isActive = false, 
  isListening = false, 
  message = '', 
  className = '',
  isScanning = false
}: MedicalAvatar3DProps) {
  const { avatarScanning, scanPosition } = useScan();
  
  console.log("Avatar scanning state:", avatarScanning); // Debug
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
    // No background - transparent
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
      premultipliedAlpha: false,
      powerPreference: "high-performance"
    });
    // Dynamic size based on className - web +8%, mobile optimized
    const size = className?.includes('w-40') ? 162 : className?.includes('w-24') ? 92 : 65;
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting - natural professional
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 4, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Medical professional lighting (neutral fill)
    const fillLight = new THREE.DirectionalLight(0xf0f0f0, 0.3);
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
      // Super green glow when listening - muito mais intenso
      lights.forEach(light => {
        if (light instanceof THREE.DirectionalLight) {
          light.color.setRGB(0.0, 1.0, 0.4); // Verde neon super vibrante
          light.intensity = 2.5;
        }
      });
    } else if (isActive) {
      // Bright green when active - bem chamativo
      lights.forEach(light => {
        if (light instanceof THREE.DirectionalLight) {
          light.color.setRGB(0.133, 0.973, 0.569); // Verde-lima brilhante #22f591
          light.intensity = 2.0;
        }
      });
    } else {
      // Soft green when idle - não cinza, mas verde suave
      lights.forEach(light => {
        if (light instanceof THREE.DirectionalLight) {
          light.color.setRGB(0.2, 0.7, 0.4); // Verde suave
          light.intensity = 1.2;
        }
      });
    }
  }, [isActive, isListening]);

  return (
    <div className={`relative ${className}`}>
      {/* Removido: efeitos visuais estranhos do avatar conforme solicitado */}
      
      {/* 3D Avatar Container - Free floating */}
      <div 
        ref={mountRef} 
        className={`relative transition-all duration-500 ${className} ${
          isActive 
            ? 'drop-shadow-2xl' 
            : 'drop-shadow-lg'
        }`}
        style={{
          filter: (() => {
            // Avatar: começa 0.4s antes (12%) e termina 2s antes da linha (20%)
            const isYellowZone = scanPosition >= 12 && scanPosition <= 20;
            
            return isYellowZone
              ? 'drop-shadow(0 0 25px rgba(255,235,59,0.6)) drop-shadow(0 0 50px rgba(255,235,59,0.4)) brightness(1.2) saturate(1.1)' // Amarelo quando linha amarela
              : isActive 
              ? 'drop-shadow(0 0 30px rgba(34,197,94,0.9)) drop-shadow(0 0 60px rgba(16,185,129,0.6)) brightness(1.3) saturate(1.2)' // Verde ativo
              : 'drop-shadow(0 0 20px rgba(34,197,94,0.4)) drop-shadow(0 0 40px rgba(16,185,129,0.2)) brightness(1.0) saturate(1.1)'; // Verde normal
          })(),
          transition: 'all 0.2s ease-out'
        }}
      />

      {/* Status Indicators */}
      {isListening && (
        <div className={`absolute top-3 right-3 bg-neon-cyan rounded-full animate-pulse ${
          className?.includes('w-40') ? 'w-4 h-4' : className?.includes('w-24') ? 'w-3 h-3' : 'w-2 h-2'
        }`} />
      )}
      
      {isActive && !isListening && (
        <div className={`absolute top-3 right-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/70 ${
          className?.includes('w-40') ? 'w-4 h-4' : className?.includes('w-24') ? 'w-3 h-3' : 'w-2 h-2'
        }`} 
        style={{
          boxShadow: '0 0 15px rgba(74, 222, 128, 0.8), 0 0 30px rgba(34, 197, 94, 0.6)'
        }}
        />
      )}

      {/* Medical Badge - Escondido para interface limpa */}

      {/* Speech Indicator */}
      {message && (
        <div className={`absolute left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white rounded whitespace-nowrap ${
          className?.includes('w-40') 
            ? '-top-10 text-sm px-3 py-1.5 max-w-40' 
            : className?.includes('w-24') 
              ? '-top-8 text-xs px-2 py-1 max-w-32' 
              : '-top-6 text-[10px] px-1.5 py-0.5 max-w-24'
        } truncate`}>
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