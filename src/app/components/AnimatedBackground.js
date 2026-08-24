"use client";
import { useEffect, useState } from "react";

const AnimatedBackground = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const emojis = ["🌸", "💕", "✨", "🌺", "🩷", "💗", "🌷", "⭐"];

    const newElements = [];
    const totalElements = 20;

    for (let i = 0; i < totalElements; i++) {
      newElements.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 12 + Math.random() * 12,
        size: 14 + Math.random() * 18,
        opacity: 0.15 + Math.random() * 0.25,
        rotation: Math.random() * 360,
        floatType: Math.floor(Math.random() * 2),
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setElements(newElements);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Soft glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(245, 198, 203, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "glowFloat 12s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: "250px",
          height: "250px",
          background:
            "radial-gradient(circle, rgba(212, 155, 159, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "glowFloat 15s ease-in-out infinite reverse",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(245, 198, 203, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "glowFloat 18s ease-in-out infinite alternate",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Floating elements */}
      {elements.map((el) => (
        <div
          key={el.id}
          style={{
            position: "absolute",
            left: el.left + "%",
            top: "-5%",
            fontSize: el.size + "px",
            opacity: el.opacity,
            animation: `
              ${el.floatType === 0 ? "floatUp" : "floatDiagonal"} 
              ${el.duration}s ease-in-out ${el.delay}s infinite
            `,
            transform: `rotate(${el.rotation}deg)`,
            pointerEvents: "none",
            userSelect: "none",
            willChange: "transform",
            filter: "drop-shadow(0 0 8px rgba(212, 155, 159, 0.2))",
          }}
        >
          {el.emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) rotate(0deg) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 0.2;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) scale(1);
            opacity: 0.4;
          }
          85% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes floatDiagonal {
          0% {
            transform: translate(-50px, 100vh) rotate(0deg) scale(0.5);
            opacity: 0;
          }
          15% {
            opacity: 0.2;
          }
          50% {
            transform: translate(50px, 50vh) rotate(270deg) scale(1.1);
            opacity: 0.4;
          }
          85% {
            opacity: 0.2;
          }
          100% {
            transform: translate(-50px, -100vh) rotate(540deg) scale(0.7);
            opacity: 0;
          }
        }

        @keyframes glowFloat {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(40px, -40px) scale(1.2);
          }
          50% {
            transform: translate(-30px, 30px) scale(0.8);
          }
          75% {
            transform: translate(30px, 20px) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
