import React, { useRef, useEffect } from 'react';
import { ModuleWindow } from './ModuleWindow.jsx';

export function PortalModule({ instance }) {
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

    let time = 0;
    let running = true;

    const animate = () => {
      if (!running) return;
      time += 0.03;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, w, h);

      // Portal rings
      for (let i = 0; i < 20; i++) {
        const radius = 30 + i * 15 + Math.sin(time + i * 0.3) * 10;
        const alpha = Math.max(0, 1 - i / 20) * 0.3;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${100 + i * 8}, ${50 + i * 5}, ${200 + i * 3}, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Spiral particles
      for (let i = 0; i < 100; i++) {
        const angle = time * 0.5 + i * 0.1;
        const dist = 50 + (i % 20) * 12 + Math.sin(time * 2 + i) * 20;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const size = 1 + Math.sin(time + i) * 1;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${150 + i}, ${100}, ${255 - i}, 0.6)`;
        ctx.fill();
      }

      // Center glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
      gradient.addColorStop(0, 'rgba(200, 100, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

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
