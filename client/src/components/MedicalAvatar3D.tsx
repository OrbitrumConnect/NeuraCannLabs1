import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useScan } from "@/contexts/ScanContext";

interface MedicalAvatar3DProps {
  isActive?: boolean;
  isListening?: boolean;
  isSpeaking?: boolean;
  message?: string;
  className?: string;
  isScanning?: boolean;
}

export default function MedicalAvatar3D({ 
  isActive = false, 
  isListening = false, 
  isSpeaking = false,
  message = '', 
  className = '',
  isScanning = false
}: MedicalAvatar3DProps) {
  const { avatarScanning, scanPosition } = useScan();
  
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const mouthAnimationRef = useRef<NodeJS.Timeout | null>(null);
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
    // Dynamic size based on className - mobile otimizado para melhor sincronização
    const size = className?.includes('w-40') ? 162 : className?.includes('w-24') ? 92 : 65;
    const isMobile = size <= 65;
    

    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting - otimizado para mobile e desktop
    const ambientLight = new THREE.AmbientLight(0x404040, isMobile ? 0.8 : 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, isMobile ? 1.2 : 1);
    directionalLight.position.set(2, 4, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = isMobile ? 512 : 1024;
    directionalLight.shadow.mapSize.height = isMobile ? 512 : 1024;
    scene.add(directionalLight);

    // Medical professional lighting - mais intenso no mobile
    const fillLight = new THREE.DirectionalLight(0xf0f0f0, isMobile ? 0.5 : 0.3);
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
      // Green glow when listening - ultra sutil
      lights.forEach(light => {
        if (light instanceof THREE.DirectionalLight) {
          light.color.setRGB(0.0, 0.5, 0.2); // Verde bem suave
          light.intensity = 0.5; // Ultra reduzido
        }
      });
    } else if (isActive) {
      // Green when active - quase imperceptível
      lights.forEach(light => {
        if (light instanceof THREE.DirectionalLight) {
          light.color.setRGB(0.05, 0.5, 0.3); // Verde muito sutil
          light.intensity = 0.4; // Muito baixo
        }
      });
    } else {
      // Soft green when idle - mínimo
      lights.forEach(light => {
        if (light instanceof THREE.DirectionalLight) {
          light.color.setRGB(0.15, 0.5, 0.3); // Verde mínimo
          light.intensity = 0.3; // Bem baixo
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
            // Avatar: sincronização UNIVERSAL - usa EXATA posição da linha
            const linePos = scanPosition; // Usa diretamente a posição do scanner
            const isYellowZone = linePos >= 32 && linePos <= 42; // Mesma zona da linha
            
            const isMobileView = (className?.includes('w-16') || (!className?.includes('w-40') && !className?.includes('w-24')));
            return isYellowZone
              ? `drop-shadow(0 0 ${isMobileView ? '3px' : '5px'} rgba(255,235,59,0.15)) drop-shadow(0 0 ${isMobileView ? '6px' : '10px'} rgba(255,235,59,0.12)) brightness(1.06) saturate(1.03)` // Amarelo ultra sutil
              : isActive 
              ? 'drop-shadow(0 0 4px rgba(34,197,94,0.15)) drop-shadow(0 0 8px rgba(16,185,129,0.10)) brightness(1.03) saturate(1.02)' // Verde ativo muito sutil
              : 'drop-shadow(0 0 2px rgba(34,197,94,0.08)) drop-shadow(0 0 4px rgba(16,185,129,0.04)) brightness(1.0) saturate(1.01)'; // Verde normal quase imperceptível
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
        <div className={`absolute top-3 right-3 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/30 ${
          className?.includes('w-40') ? 'w-3 h-3' : className?.includes('w-24') ? 'w-2 h-2' : 'w-1.5 h-1.5'
        }`} 
        style={{
          boxShadow: '0 0 4px rgba(74, 222, 128, 0.24), 0 0 8px rgba(34, 197, 94, 0.18)'
        }}
        />
      )}

      {/* Medical Badge - Escondido para interface limpa */}

      {/* Simulação de Movimento da Boca - Overlay sutil durante fala */}
      {isSpeaking && (
        <div className={`absolute bottom-1/3 left-1/2 transform -translate-x-1/2 ${
          className?.includes('w-40') ? 'w-4 h-2' : className?.includes('w-24') ? 'w-3 h-1.5' : 'w-2 h-1'
        }`}>
          <div 
            className="bg-gradient-to-r from-pink-300/20 via-red-300/30 to-pink-300/20 rounded-full animate-pulse"
            style={{
              animation: 'mouthMovement 0.3s ease-in-out infinite alternate',
            }}
          />
        </div>
      )}

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