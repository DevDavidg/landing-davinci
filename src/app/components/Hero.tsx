"use client";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import HeroLayout from "./HeroLayout";

interface Particle {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: [number, number, number];
  mass: number;
}

interface AnimationState {
  whirlTime: number;
  whirlActive: boolean;
  returnForce: number;
  fadeProgress: number;
  isComplete: boolean;
}

export interface HeroConfig {
  particleStep?: number;
  brightnessFactor?: number;
  whirlpoolDurationMs?: number;
  clickRadius?: number;
  clickStrength?: number;
  interactionRadius?: number;
  imageSrc?: string;
}

const defaultConfig: Required<HeroConfig> = {
  particleStep: 6,
  brightnessFactor: 1.5,
  whirlpoolDurationMs: 4000,
  clickRadius: 150,
  clickStrength: 8,
  interactionRadius: 50,
  imageSrc: "/banner-hero.png",
};

class ParticleSystem {
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number = 0;
  private config: Required<HeroConfig>;
  private timeoutId: number | null = null;

  private mouse = { x: 0, y: 0 };
  private clickPoint: { x: number; y: number } | null = null;
  private animationState: AnimationState = {
    whirlTime: 0,
    whirlActive: true,
    returnForce: 0,
    fadeProgress: 0,
    isComplete: false,
  };

  constructor(canvas: HTMLCanvasElement, config: Required<HeroConfig>) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.config = config;
  }

  private calculateDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private applyForce(
    particle: Particle,
    fx: number,
    fy: number,
    strength: number = 1
  ): void {
    particle.vx += (fx * strength) / particle.mass;
    particle.vy += (fy * strength) / particle.mass;
  }

  private updateWhirlpool(): void {
    if (!this.animationState.whirlActive) return;

    this.animationState.whirlTime -= 0.8;
    const { width, height } = this.canvas;
    const centerX = width / 2;
    const centerY = height / 2.2;
    const whirlX = centerX + Math.cos(this.animationState.whirlTime) * 1.5;
    const whirlY = centerY + Math.sin(this.animationState.whirlTime) * 1.5;

    this.particles.forEach((particle) => {
      const dx = whirlX - particle.x;
      const dy = whirlY - particle.y;
      const distance = this.calculateDistance(
        particle.x,
        particle.y,
        whirlX,
        whirlY
      );

      if (distance > 1) {
        const normalizedDistance =
          (1 - distance / Math.max(width, height)) ** 2;
        const radialForce = 0.035 * normalizedDistance;
        const tangentialForce = 3.5 * normalizedDistance;

        this.applyForce(particle, dx / distance, dy / distance, radialForce);
        this.applyForce(
          particle,
          -dy / distance,
          dx / distance,
          tangentialForce
        );

        particle.vx *= 0.4;
        particle.vy *= 0.4;
      }
    });
  }

  private updateReturnToOrigin(): void {
    if (this.animationState.whirlActive) return;

    let allAtOrigin = true;

    this.particles.forEach((particle) => {
      const dx = particle.ox - particle.x;
      const dy = particle.oy - particle.y;
      const distanceFromOrigin = this.calculateDistance(
        particle.x,
        particle.y,
        particle.ox,
        particle.oy
      );

      if (distanceFromOrigin > 32) {
        allAtOrigin = false;
      }

      this.applyForce(particle, dx, dy, this.animationState.returnForce);
      particle.vx *= 0.93;
      particle.vy *= 0.93;
    });

    if (allAtOrigin && this.animationState.fadeProgress < 1) {
      this.animationState.fadeProgress = Math.min(
        this.animationState.fadeProgress + 0.016,
        1
      );
      if (this.animationState.fadeProgress >= 1) {
        this.animationState.isComplete = true;
      }
    }
  }

  private updateMouseInteraction(): void {
    this.particles.forEach((particle) => {
      const distance = this.calculateDistance(
        particle.x,
        particle.y,
        this.mouse.x,
        this.mouse.y
      );

      if (distance < this.config.interactionRadius && distance > 0.1) {
        const force =
          (this.config.interactionRadius - distance) /
          this.config.interactionRadius;
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;

        this.applyForce(particle, -dx / distance, -dy / distance, force * 2.0);
      }
    });
  }

  private updateClickEffect(): void {
    if (!this.clickPoint) return;

    const clickPoint = this.clickPoint;
    this.particles.forEach((particle) => {
      const distance = this.calculateDistance(
        particle.x,
        particle.y,
        clickPoint.x,
        clickPoint.y
      );

      if (distance < this.config.clickRadius && distance > 0.1) {
        const force =
          (this.config.clickRadius - distance) / this.config.clickRadius;
        const dx = particle.x - clickPoint.x;
        const dy = particle.y - clickPoint.y;

        this.applyForce(
          particle,
          dx / distance,
          dy / distance,
          this.config.clickStrength * force
        );
      }
    });

    this.clickPoint = null;
  }

  private updateParticles(): void {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
    });
  }

  private render(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    this.particles.forEach((particle) => {
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = `rgb(${particle.color[0]},${particle.color[1]},${particle.color[2]})`;
      this.ctx.fillRect(
        particle.x - particle.size / 2,
        particle.y - particle.size / 2,
        particle.size,
        particle.size
      );
    });
  }

  public update(): boolean {
    this.updateClickEffect();
    this.updateWhirlpool();
    this.updateReturnToOrigin();
    this.updateMouseInteraction();
    this.updateParticles();
    this.render();

    return !this.animationState.isComplete;
  }

  public setMousePosition(x: number, y: number): void {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  public triggerClick(x: number, y: number): void {
    this.clickPoint = { x, y };
  }

  public initialize(imageData: ImageData): void {
    const { width, height, data } = imageData;
    const step = Math.max(1, this.config.particleStep);

    this.particles = [];
    this.animationState = {
      whirlTime: 0,
      whirlActive: true,
      returnForce: 0,
      fadeProgress: 0,
      isComplete: false,
    };

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];

        if (alpha > 30) {
          const r = Math.min(255, data[index] * this.config.brightnessFactor);
          const g = Math.min(
            255,
            data[index + 1] * this.config.brightnessFactor
          );
          const b = Math.min(
            255,
            data[index + 2] * this.config.brightnessFactor
          );

          this.particles.push({
            x,
            y,
            ox: x,
            oy: y,
            vx: 0,
            vy: 0,
            alpha: (alpha / 255) * 1.2,
            size: Math.max(1, step / 3) * (0.75 + Math.random() * 0.5),
            color: [r, g, b],
            mass: 0.7 + Math.random() * 0.6,
          });
        }
      }
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => {
      this.animationState.whirlActive = false;
      this.animationState.returnForce = 0.02;
    }, this.config.whirlpoolDurationMs);
  }

  public getFadeProgress(): number {
    return this.animationState.fadeProgress;
  }

  public isComplete(): boolean {
    return this.animationState.isComplete;
  }

  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

const useImageLoader = (src: string) => {
  const [imageData, setImageData] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    const loadPromise = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });

    img.src = src;

    loadPromise
      .then(() => {
        setImageData(img);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  const processImage = useCallback(
    (img: HTMLImageElement, width: number, height: number): ImageData => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

      canvas.width = width;
      canvas.height = height;

      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const canvasAspectRatio = width / height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (aspectRatio > canvasAspectRatio) {
        drawHeight = height;
        drawWidth = drawHeight * aspectRatio;
        offsetX = (width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = width;
        drawHeight = drawWidth / aspectRatio;
        offsetX = 0;
        offsetY = (height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      return ctx.getImageData(0, 0, width, height);
    },
    []
  );

  return { imageData, isLoading, error, processImage };
};

const useParticleAnimation = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  imageData: HTMLImageElement | null,
  config: Required<HeroConfig>,
  processImage: (
    img: HTMLImageElement,
    width: number,
    height: number
  ) => ImageData
) => {
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const [fadeProgress, setFadeProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const animate = useCallback(() => {
    if (!particleSystemRef.current) return;

    const shouldContinue = particleSystemRef.current.update();
    setFadeProgress(particleSystemRef.current.getFadeProgress());
    setIsComplete(particleSystemRef.current.isComplete());

    if (shouldContinue) {
      requestAnimationFrame(animate);
    }
  }, []);

  const initializeParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const newData = processImage(imageData, canvas.width, canvas.height);

    if (particleSystemRef.current) {
      particleSystemRef.current.destroy();
    }

    const particleSystem = new ParticleSystem(canvas, config);
    particleSystem.initialize(newData);
    particleSystemRef.current = particleSystem;

    requestAnimationFrame(animate);
  }, [canvasRef, imageData, config, processImage, animate]);

  useEffect(() => {
    if (!imageData) return;

    initializeParticles();

    const handleResize = () => {
      setTimeout(initializeParticles, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (particleSystemRef.current) {
        particleSystemRef.current.destroy();
        particleSystemRef.current = null;
      }
    };
  }, [initializeParticles, imageData]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !particleSystemRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      particleSystemRef.current.setMousePosition(x, y);
    },
    [canvasRef]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !particleSystemRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      particleSystemRef.current.triggerClick(x, y);
    },
    [canvasRef]
  );

  return {
    fadeProgress,
    isComplete,
    handleMouseMove,
    handleClick,
  };
};

const Hero = (props: HeroConfig = {}) => {
  const config = useMemo(() => ({ ...defaultConfig, ...props }), [props]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { imageData, isLoading, error, processImage } = useImageLoader(
    config.imageSrc
  );

  const { fadeProgress, isComplete, handleMouseMove, handleClick } =
    useParticleAnimation(canvasRef, imageData, config, processImage);

  if (error) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl mb-2">Error loading hero image</h2>
          <p className="text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-t-white rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#000010]">
      <HeroLayout
        isAnimationComplete={isComplete}
        fadeProgress={fadeProgress}
      />

      {!isComplete && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-pointer z-10"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        />
      )}

      <Image
        src={config.imageSrc}
        alt="Hero"
        fill
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{
          opacity: fadeProgress,
          transition: fadeProgress > 0 ? "opacity 2s ease-in-out" : "none",
        }}
        priority
        sizes="100vw"
      />
    </div>
  );
};

export default Hero;
