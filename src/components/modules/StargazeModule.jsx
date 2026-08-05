import React, { useRef, useEffect } from 'react';
import { ModuleWindow } from './ModuleWindow.jsx';

export function StargazeModule({ instance }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Generate stars
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2 + 0.5,
      brightness: Math.random(),
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    // Constellation lines
    const constellations = [];
    for (let i = 0; i < 8; i++) {
      const start = Math.floor(Math.random() * stars.length);
      const count = Math.floor(Math.random() * 4) + 3;
      const line = [start];
      for (let j = 1; j < count; j++) {
        let next;
        do { next = Math.floor(Math.random() * stars.length); }
        while (line.includes(next));
        line.push(next);
      }
      constellations.push(line);
    }

    let time = 0;
    let running = true;

    const animate = () => {
      if (!running) return;
      time += 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, w, h);

      // Draw stars
      stars.forEach((star, i) => {
        const sx = star.x * w;
        const sy = star.y * h;
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
        const alpha = star.brightness * twinkle;

        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
        ctx.fill();

        // Glow for bright stars
        if (star.brightness > 0.8) {
          ctx.beginPath();
          ctx.arc(sx, sy, star.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 180, 255, ${alpha * 0.1})`;
          ctx.fill();
        }
      });

      // Draw constellation lines
      constellations.forEach(line => {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(100, 180, 255, 0.15)';
        ctx.lineWidth = 0.5;
        line.forEach((starIdx, i) => {
          const star = stars[starIdx];
          const x = star.x * w;
          const y = star.y * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resize);
    return () => {
      running = false;
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <ModuleWindow instance={instance}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </ModuleWindow>
  );
}
