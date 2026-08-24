'use client'
import { useEffect, useState } from 'react'

const AnimatedBackgroundPremium = () => {
  const [elements, setElements] = useState([])
  const [sparkles, setSparkles] = useState([])

  useEffect(() => {
    // Layer 1: Large, slow floating elements (background)
    const largeEmojis = ['🌸', '🌺', '💕', '🦋', '🌷', '💎', '🌹', '🌼']
    const largeElements = []
    for (let i = 0; i < 20; i++) {
      largeElements.push({
        id: `large-${i}`,
        emoji: largeEmojis[Math.floor(Math.random() * largeEmojis.length)],
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 18 + Math.random() * 15,
        size: 35 + Math.random() * 35,
        opacity: 0.15 + Math.random() * 0.2,
        rotation: Math.random() * 360,
        type: 'large'
      })
    }

    // Layer 2: Medium, faster elements (mid-ground)
    const mediumEmojis = ['✨', '💫', '⭐', '🌟', '✧', '💗', '💖', '💝']
    const mediumElements = []
    for (let i = 0; i < 30; i++) {
      mediumElements.push({
        id: `medium-${i}`,
        emoji: mediumEmojis[Math.floor(Math.random() * mediumEmojis.length)],
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 12 + Math.random() * 10,
        size: 20 + Math.random() * 20,
        opacity: 0.3 + Math.random() * 0.3,
        rotation: Math.random() * 360,
        type: 'medium'
      })
    }

    // Layer 3: Small, fast sparkles (foreground)
    const smallEmojis = ['✦', '✧', '★', '☆', '•', '◦']
    const smallElements = []
    for (let i = 0; i < 40; i++) {
      smallElements.push({
        id: `small-${i}`,
        emoji: smallEmojis[Math.floor(Math.random() * smallEmojis.length)],
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 8 + Math.random() * 8,
        size: 12 + Math.random() * 12,
        opacity: 0.4 + Math.random() * 0.4,
        rotation: Math.random() * 360,
        type: 'small'
      })
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setElements([...largeElements, ...mediumElements, ...smallElements])

    // Create floating hearts that form shapes occasionally
    const heartElements = []
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2
      heartElements.push({
        id: `heart-${i}`,
        emoji: '❤️',
        x: 50 + Math.cos(angle) * 30,
        y: 50 + Math.sin(angle) * 30,
        delay: i * 0.5,
        duration: 20 + Math.random() * 10,
        size: 16 + Math.random() * 12,
        opacity: 0.15 + Math.random() * 0.15,
        type: 'heart'
      })
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSparkles(heartElements)

  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}>
      {/* Layer 1: Large Elements */}
      {elements.filter(el => el.type === 'large').map((el) => (
        <div
          key={el.id}
          style={{
            position: 'absolute',
            left: el.left + '%',
            top: '-10%',
            fontSize: el.size + 'px',
            opacity: el.opacity,
            pointerEvents: 'none',
            userSelect: 'none',
            willChange: 'transform',
            animation: `floatLarge ${el.duration}s ease-in-out ${el.delay}s infinite`,
            textShadow: '0 0 30px rgba(212, 155, 159, 0.2)',
            transform: `rotate(${el.rotation}deg)`,
          }}
        >
          {el.emoji}
        </div>
      ))}

      {/* Layer 2: Medium Elements */}
      {elements.filter(el => el.type === 'medium').map((el) => (
        <div
          key={el.id}
          style={{
            position: 'absolute',
            left: el.left + '%',
            top: '-5%',
            fontSize: el.size + 'px',
            opacity: el.opacity,
            pointerEvents: 'none',
            userSelect: 'none',
            willChange: 'transform',
            animation: `floatMedium ${el.duration}s ease-in-out ${el.delay}s infinite`,
            textShadow: '0 0 20px rgba(212, 155, 159, 0.3)',
            transform: `rotate(${el.rotation}deg)`,
          }}
        >
          {el.emoji}
        </div>
      ))}

      {/* Layer 3: Small Sparkles */}
      {elements.filter(el => el.type === 'small').map((el) => (
        <div
          key={el.id}
          style={{
            position: 'absolute',
            left: el.left + '%',
            top: '-3%',
            fontSize: el.size + 'px',
            opacity: el.opacity,
            pointerEvents: 'none',
            userSelect: 'none',
            willChange: 'transform',
            animation: `floatSmall ${el.duration}s ease-in-out ${el.delay}s infinite`,
            transform: `rotate(${el.rotation}deg)`,
          }}
        >
          {el.emoji}
        </div>
      ))}

      {/* Heart Formation */}
      {sparkles.map((el) => (
        <div
          key={el.id}
          style={{
            position: 'absolute',
            left: el.x + '%',
            top: el.y + '%',
            fontSize: el.size + 'px',
            opacity: el.opacity,
            pointerEvents: 'none',
            userSelect: 'none',
            animation: `heartFloat ${el.duration}s ease-in-out ${el.delay}s infinite`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {el.emoji}
        </div>
      ))}

      {/* Colorful Glowing Orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(245, 198, 203, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'glowFloat 15s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(212, 155, 159, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'glowFloat 20s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(245, 198, 203, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'glowFloat 25s ease-in-out infinite alternate',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
      }} />

      <style jsx>{`
        @keyframes floatLarge {
          0% {
            transform: translateY(100vh) rotate(0deg) scale(0.5);
            opacity: 0;
          }
          10% { opacity: 0.2; }
          50% {
            transform: translateY(50vh) rotate(360deg) scale(1.2);
            opacity: 0.4;
          }
          90% { opacity: 0.2; }
          100% {
            transform: translateY(-100vh) rotate(720deg) scale(0.7);
            opacity: 0;
          }
        }
        
        @keyframes floatMedium {
          0% {
            transform: translateY(100vh) rotate(0deg) scale(0.4);
            opacity: 0;
          }
          10% { opacity: 0.4; }
          50% {
            transform: translateY(50vh) rotate(540deg) scale(1.1);
            opacity: 0.6;
          }
          90% { opacity: 0.4; }
          100% {
            transform: translateY(-100vh) rotate(1080deg) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes floatSmall {
          0% {
            transform: translateY(100vh) rotate(0deg) scale(0.3);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          50% {
            transform: translateY(50vh) rotate(720deg) scale(1);
            opacity: 0.8;
          }
          90% { opacity: 0.6; }
          100% {
            transform: translateY(-100vh) rotate(1440deg) scale(0.3);
            opacity: 0;
          }
        }
        
        @keyframes heartFloat {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 0.15;
          }
          25% { 
            transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
            opacity: 0.3;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1) rotate(-5deg);
            opacity: 0.25;
          }
          75% { 
            transform: translate(-50%, -50%) scale(1.3) rotate(15deg);
            opacity: 0.3;
          }
        }
        
        @keyframes glowFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(60px, -60px) scale(1.2); }
          50% { transform: translate(-40px, 40px) scale(0.8); }
          75% { transform: translate(50px, 30px) scale(1.1); }
        }
      `}</style>
    </div>
  )
}

export default AnimatedBackgroundPremium