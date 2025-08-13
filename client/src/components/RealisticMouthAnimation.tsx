import { useEffect, useRef, useState } from 'react';

interface RealisticMouthAnimationProps {
  imageUrl: string;
  isAnimating: boolean;
  className?: string;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

export function RealisticMouthAnimation({ 
  imageUrl, 
  isAnimating, 
  className = "",
  audioRef 
}: RealisticMouthAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationFrame, setAnimationFrame] = useState(0);
  const animationId = useRef<number>();

  useEffect(() => {
    if (!isAnimating || !canvasRef.current) {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      const animate = () => {
        if (!isAnimating) return;
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar imagem base
        ctx.drawImage(img, 0, 0);
        
        // Adicionar efeito de movimento na região da boca - Mais realista
        if (isAnimating) {
          // Movimento mais suave e natural da boca
          const time = Date.now() * 0.005;
          const intensity = Math.abs(Math.sin(time)) * 0.7 + 0.3;
          const variation = Math.sin(time * 1.3) * 0.2;
          
          // Região da boca ajustada para ser mais precisa
          const mouthX = canvas.width * 0.42;
          const mouthY = canvas.height * 0.72;
          const mouthWidth = canvas.width * 0.16;
          const mouthHeight = canvas.height * 0.08;
          
          // Salvar estado do canvas
          ctx.save();
          
          // Aplicar transformações sutis para movimento facial
          ctx.translate(canvas.width/2, canvas.height/2);
          ctx.scale(1 + variation * 0.01, 1 + intensity * 0.02);
          ctx.translate(-canvas.width/2, -canvas.height/2);
          
          // Criar efeito de brilho nos lábios
          const lipGradient = ctx.createLinearGradient(
            mouthX, mouthY, 
            mouthX + mouthWidth, mouthY + mouthHeight
          );
          
          lipGradient.addColorStop(0, `rgba(255, 140, 140, ${intensity * 0.4})`);
          lipGradient.addColorStop(0.5, `rgba(255, 180, 180, ${intensity * 0.2})`);
          lipGradient.addColorStop(1, `rgba(255, 140, 140, ${intensity * 0.3})`);
          
          // Desenhar movimento dos lábios
          ctx.fillStyle = lipGradient;
          ctx.beginPath();
          ctx.ellipse(
            mouthX + mouthWidth/2,
            mouthY + mouthHeight/2,
            mouthWidth/2,
            (mouthHeight/2) * (1 + intensity * 0.6),
            0,
            0,
            2 * Math.PI
          );
          ctx.fill();
          
          // Adicionar brilho realista
          const highlightGradient = ctx.createRadialGradient(
            mouthX + mouthWidth/2, 
            mouthY + mouthHeight/3, 
            0, 
            mouthX + mouthWidth/2, 
            mouthY + mouthHeight/3, 
            mouthWidth/3
          );
          
          highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.3})`);
          highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = highlightGradient;
          ctx.fill();
          
          // Restaurar estado do canvas
          ctx.restore();
        }
        
        setAnimationFrame(prev => prev + 1);
        animationId.current = requestAnimationFrame(animate);
      };
      
      animate();
    };
    
    img.src = imageUrl;
    
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [imageUrl, isAnimating, audioRef]);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef}
        className={`${className} transition-all duration-300`}
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          filter: isAnimating ? 'brightness(110%) contrast(105%)' : 'none'
        }}
      />
      {isAnimating && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-400/80 text-white px-3 py-1 rounded-full text-xs animate-pulse">
          🗣️ Falando
        </div>
      )}
    </div>
  );
}