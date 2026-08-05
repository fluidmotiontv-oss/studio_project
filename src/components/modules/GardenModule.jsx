import React, { useRef, useEffect } from 'react';
import { ModuleWindow } from './ModuleWindow.jsx';

export function GardenModule({ instance }) {
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

    // Plants
    const plants = Array.from({ length: 12 }, (_, i) => ({
      x: 0.1 + (i / 11) * 0.8,
      height: 50 + Math.random() * 150,
      color: `hsl(${120 + Math.random() * 60}, ${60 + Math.random() * 30}%, ${30 + Math.random() * 30}%)`,
      swaySpeed: 0.5 + Math.random() * 1.5,
      swayAmount: 5 + Math.random() * 15,
      branches: Math.floor(Math.random() * 3) + 2,
    }));

    let time = 0;
    let running = true;

    const drawPlant = (plant, w, h) => {
      const px = plant.x * w;
      const baseY = h - 20;

      ctx.strokeStyle = plant.color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      const sway = Math.sin(time * plant.swaySpeed) * plant.swayAmount;

      // Main stem
      ctx.beginPath();
      ctx.moveTo(px, baseY);
      ctx.quadraticCurveTo(
        px + sway * 0.5, baseY - plant.height * 0.5,
        px + sway, baseY - plant.height
      );
      ctx.stroke();

      // Branches
      for (let b = 0; b < plant.branches; b++) {
        const branchY = baseY - plant.height * (0.3 + b * 0.25);
        const branchSway = Math.sin(time * plant.swaySpeed * 1.3 + b) * plant.swayAmount * 0.6;
        const side = b % 2 === 0 ? 1 : -1;

        ctx.beginPath();
        ctx.moveTo(px + sway * (branchY - baseY) / plant.height, branchY);
        ctx.quadraticCurveTo(
          px + sway * (branchY - baseY) / plant.height + side * 20, branchY - 30,
          px + sway * (branchY - baseY) / plant.height + side * 40 + branchSway, branchY - 50
        );
        ctx.stroke();

        // Flower at branch tip
        const tipX = px + sway * (branchY - baseY) / plant.height + side * 40 + branchSway;
        const tipY = branchY - 50;

        ctx.beginPath();
        ctx.arc(tipX, tipY, 4 + Math.sin(time * 2 + b) * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${300 + b * 30}, 70%, 60%)`;
        ctx.fill();
      }
    };

    const animate = () => {
      if (!running) return;
      time += 0.02;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0a0a1a');
      skyGrad.addColorStop(0.5, '#0a1a0a');
      skyGrad.addColorStop(1, '#1a0a0a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Ground
      ctx.fillStyle = '#0a1a0a';
      ctx.fillRect(0, h - 20, w, 20);

      // Moon
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.15, 25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 200, 0.1)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.15, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 220, 0.3)';
      ctx.fill();

      // Plants
      plants.forEach(p => drawPlant(p, w, h));

      // Fireflies
      for (let i = 0; i < 15; i++) {
        const fx = (Math.sin(time * 0.3 + i * 2) * 0.5 + 0.5) * w;
        const fy = h * 0.3 + Math.sin(time * 0.5 + i * 3) * h * 0.3;
        const glow = Math.sin(time * 3 + i) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 100, ${glow * 0.8})`;
        ctx.fill();
      }

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
