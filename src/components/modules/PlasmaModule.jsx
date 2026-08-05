import React, { useRef, useEffect } from 'react';
import { ModuleWindow } from './ModuleWindow.jsx';

export function PlasmaModule({ instance }) {
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
      time += 0.02;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          const nx = x / w;
          const ny = y / h;

          const v1 = Math.sin(nx * 10 + time) * Math.cos(ny * 8 + time * 0.7);
          const v2 = Math.sin(nx * 6 - time * 0.5) * Math.sin(ny * 12 + time);
          const v3 = Math.cos((nx + ny) * 15 + time * 1.2);

          const plasma = (v1 + v2 + v3) / 3;

          const r = Math.floor(128 + plasma * 127 * Math.sin(time * 0.3));
          const g = Math.floor(50 + plasma * 100 * Math.cos(time * 0.2));
          const b = Math.floor(200 + plasma * 55 * Math.sin(time * 0.5));

          // Fill 2x2 block
          for (let dy = 0; dy < 2 && y + dy < h; dy++) {
            for (let dx = 0; dx < 2 && x + dx < w; dx++) {
              const i = ((y + dy) * w + (x + dx)) * 4;
              data[i] = r;
              data[i + 1] = g;
              data[i + 2] = b;
              data[i + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
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
