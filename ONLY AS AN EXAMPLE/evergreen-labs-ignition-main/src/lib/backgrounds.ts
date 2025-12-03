export const dotPattern = {
  backgroundImage: 'radial-gradient(circle, hsl(220 18% 20%) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

export const gradientRadial = {
  background: 'radial-gradient(ellipse at 50% 0%, hsl(217 91% 60% / 0.08), transparent 60%)',
};

export const gradientHero = {
  background: 'linear-gradient(135deg, hsl(220 20% 5%) 0%, hsl(220 18% 8%) 50%, hsl(220 20% 5%) 100%)',
};

export const glowBlue = {
  boxShadow: '0 0 60px hsl(217 91% 60% / 0.3)',
};

export const generateRandomDots = (count: number, width: number, height: number) => {
  const dots = [];
  for (let i = 0; i < count; i++) {
    dots.push({
      x: Math.random() * width,
      y: Math.random() * height,
      opacity: Math.random() * 0.5 + 0.1,
      size: Math.random() * 2 + 1,
    });
  }
  return dots;
};
