import React, { useRef, useEffect } from 'react';
import { useAudioEngine } from '../../hooks/useAudioEngine.js';

export function AudioVisualizer() {
  const { visualizerData, waveformData, isPlaying } = useAudioEngine();
  const freqCanvasRef = useRef(null);
  const waveCanvasRef = useRef(null);

  // Frequency bars
  useEffect(() => {
    const canvas = freqCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, w, h);

    if (!isPlaying) {
      // Idle state
      ctx.fillStyle = '#1e1e2e';
      for (let i = 0; i < 64; i++) {
        const barW = w / 64;
        const barH = h * 0.1;
        ctx.fillRect(i * barW + 1, h - barH, barW - 2, barH);
      }
      return;
    }

    // Draw frequency bars
    const barCount = 64;
    const barW = w / barCount;

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * visualizerData.length);
      const value = visualizerData[dataIndex] || 0;
      const barH = (value / 255) * h * 0.9;

      // Color gradient based on frequency
      const hue = 180 + (i / barCount) * 160; // cyan to magenta
      const saturation = 80 + (value / 255) * 20;
      const lightness = 40 + (value / 255) * 30;

      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.fillRect(i * barW + 1, h - barH, barW - 2, barH);

      // Reflection
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.15)`;
      ctx.fillRect(i * barW + 1, h, barW - 2, barH * 0.3);
    }
  }, [visualizerData, isPlaying]);

  // Waveform
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, w, h);

    if (!isPlaying) {
      ctx.strokeStyle = '#1e1e2e';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      return;
    }

    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const sliceWidth = w / waveformData.length;
    for (let i = 0; i < waveformData.length; i++) {
      const v = (waveformData[i] || 128) / 128.0;
      const y = (v * h) / 2;

      if (i === 0) ctx.moveTo(0, y);
      else ctx.lineTo(i * sliceWidth, y);
    }
    ctx.stroke();

    // Glow effect
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
    ctx.lineWidth = 6;
    ctx.stroke();
  }, [waveformData, isPlaying]);

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-orbitron text-fluid-magenta tracking-widest">VISUALIZER</span>
        <div className="flex gap-2">
          <span className="text-[9px] text-gray-500">FREQ</span>
          <span className="text-[9px] text-gray-500">WAVE</span>
        </div>
      </div>

      <canvas ref={freqCanvasRef} className="flex-1 w-full rounded bg-fluid-void border border-fluid-panel mb-2" />
      <canvas ref={waveCanvasRef} className="h-20 w-full rounded bg-fluid-void border border-fluid-panel" />
    </div>
  );
}
