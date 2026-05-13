import { useEffect, useRef } from 'react';

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01';

export default function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const fontSize = 13;
    const cols     = Math.floor(W / fontSize);
    const drops    = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(10,10,15,0.04)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#00ff4108';
      ctx.font      = `${fontSize}px JetBrains Mono`;

      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const id = setInterval(draw, 60);

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => { clearInterval(id); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
