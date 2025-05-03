'use client'

import React, { useEffect, useRef, useState } from 'react'

interface SmartPlayerVideoProps {
  onVideoEnd?: () => void
  onVideoProgress?: (progress: number) => void
  onVideoDurationChange?: (duration: number) => void
}

// Add type declaration for window.smartplayer
declare global {
  interface Window {
    smartplayer: any;
  }
}

export default function SmartPlayerVideo({ onVideoEnd, onVideoProgress, onVideoDurationChange }: SmartPlayerVideoProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(603); // Duração aproximada do vídeo em segundos (10 minutos)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Inicializa o script do SmartPlayer
    if (!document.getElementById('scr_677d9c8eff033f1549b4ef3e')) {
      const script = document.createElement('script');
      script.src = 'https://scripts.converteai.net/ac126580-0731-4f45-9424-c0e1a1514295/players/677d9c8eff033f1549b4ef3e/player.js';
      script.async = true;
      script.id = 'scr_677d9c8eff033f1549b4ef3e';
      document.head.appendChild(script);
    }
    
    // Configura um intervalo para monitorar o vídeo
    const monitorVideo = () => {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        // Atualiza a duração total do vídeo se disponível
        if (videoElement.duration && videoElement.duration > 0) {
          const duration = Math.floor(videoElement.duration);
          setTotalDuration(duration);
          console.log('Video duration detected:', duration);
          
          // Notifica o componente pai sobre a duração
          if (onVideoDurationChange) {
            onVideoDurationChange(duration);
          }
        }
        
        // Monitora o progresso do vídeo
        if (videoElement.duration && videoElement.duration > 0) {
          const progress = (videoElement.currentTime / videoElement.duration) * 100;
          const remaining = Math.max(0, Math.floor(videoElement.duration - videoElement.currentTime));
          
          // Atualiza o tempo restante
          setTimeRemaining(remaining);
          
          // Notifica o componente pai sobre o progresso
          if (onVideoProgress) {
            onVideoProgress(progress);
          }
          
          // Verifica se o vídeo terminou
          if (videoElement.ended || progress > 99.5) {
            if (onVideoEnd) {
              onVideoEnd();
            }
          }
        }
      }
    };
    
    // Inicia o monitoramento a cada segundo
    timerIntervalRef.current = setInterval(monitorVideo, 1000);
    
    // Cleanup
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [onVideoEnd, onVideoProgress, onVideoDurationChange]);

  return (
    <div className="w-full">
      {/* Video Player Container */}
      <div className="relative w-full rounded-xl overflow-hidden">
        {/* Div principal do SmartPlayer - NÃO MODIFIQUE ESTE ID */}
        <div id="vid_677d9c8eff033f1549b4ef3e" style={{ position: 'relative', width: '100%', padding: '56.25% 0 0' }}>
          {/* Timer display */}
          {/* <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 10
          }}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div> */}
        </div>
      </div>
      
      {/* Estilo para esconder botões padrão */}
      <style jsx global>{`
        .smartplayer-bigplay,
        .converteai-play-button, 
        .vjs-big-play-button, 
        .ytp-large-play-button {
          opacity: 0 !important;
          pointer-events: none !important;
          display: none !important;
          visibility: hidden !important;
        }
      `}</style>
    </div>
  );
}
