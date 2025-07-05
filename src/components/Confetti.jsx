import { useEffect, useRef } from "react";

export default function Confetti({ trigger }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Confetti properties
    const confettiCount = 120;
    const confettiColors = [
      "#fbbf24", "#85cc3c", "#3b82f6", "#ec4899", "#f97316", "#8b5cf6"
    ];
    const confetti = Array.from({ length: confettiCount }).map(() => ({
      x: Math.random() * W,
      y: Math.random() * H - H,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCount,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    }));

    let angle = 0;
    let tiltAngle = 0;
    let animationFrameId;

    function drawConfetti() {
      ctx.clearRect(0, 0, W, H);
      confetti.forEach((c, i) => {
        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 5);
        ctx.stroke();
      });
      updateConfetti();
    }

    function updateConfetti() {
      angle += 0.01;
      tiltAngle += 0.1;
      confetti.forEach((c, i) => {
        c.y += (Math.cos(angle + c.d) + 3 + c.r / 2) / 2;
        c.x += Math.sin(angle);
        c.tiltAngle += c.tiltAngleIncremental;
        c.tilt = Math.sin(c.tiltAngle - i) * 15;
        if (c.y > H) {
          c.x = Math.random() * W;
          c.y = -10;
        }
      });
    }

    function animate() {
      drawConfetti();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();
    setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, W, H);
    }, 2200);

    return () => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, W, H);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999
      }}
    />
  );
} 