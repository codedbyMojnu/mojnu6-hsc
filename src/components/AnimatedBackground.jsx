import React from "react";

export default function AnimatedBackground() {
  // Array of floating puzzle pieces and sparkles
  const pieces = [
    { top: "10%", left: "5%", delay: "0s", rotate: 8 },
    { top: "30%", left: "80%", delay: "1.2s", rotate: -12 },
    { top: "60%", left: "15%", delay: "2.1s", rotate: 18 },
    { top: "75%", left: "70%", delay: "0.7s", rotate: -6 },
    { top: "50%", left: "40%", delay: "1.7s", rotate: 0 },
    { top: "20%", left: "60%", delay: "2.7s", rotate: 14 },
  ];
  const sparkles = [
    { top: "18%", left: "25%", delay: "0.5s" },
    { top: "55%", left: "80%", delay: "1.8s" },
    { top: "80%", left: "30%", delay: "2.3s" },
    { top: "40%", left: "60%", delay: "0.9s" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
      {pieces.map((p, i) => (
        <svg
          key={i}
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            transform: `rotate(${p.rotate}deg)`,
            opacity: 0.18,
            animation: `floatPiece 6s ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        >
          <path
            d="M12 4h24a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-2a2 2 0 1 0 0 4h2a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4v-8a4 4 0 0 1 4-4h2a2 2 0 1 0 0-4h-2a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
            fill="#3b82f6"
          />
        </svg>
      ))}
      {sparkles.map((s, i) => (
        <svg
          key={"sparkle-" + i}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            opacity: 0.12,
            animation: `sparkleTwinkle 2.5s ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        >
          <circle cx="12" cy="12" r="6" fill="#fbbf24" />
          <circle cx="12" cy="12" r="3" fill="#fff" />
        </svg>
      ))}
      <style>{`
        @keyframes floatPiece {
          0% { transform: translateY(0) scale(1) rotate(0deg); }
          50% { transform: translateY(-18px) scale(1.08) rotate(3deg); }
          100% { transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes sparkleTwinkle {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50% { opacity: 0.28; transform: scale(1.18); }
        }
      `}</style>
    </div>
  );
} 