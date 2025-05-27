"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  mass: number;
}

const WHIRLPOOL_DURATION = 10000;
const PARTICLE_BRIGHTNESS_FACTOR = 1.3;
const CLICK_PUNCH_RADIUS = 150;
const CLICK_PUNCH_STRENGTH = 8;
const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mousePos = useRef({ x: 0, y: 0 });
  const imageDataRef = useRef<ImageData | null>(null);
  const whirlpoolAnimationTime = useRef(0);

  const isWhirlpoolActiveRef = useRef(true);
  const animationStopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const particleReturnForceStrengthRef = useRef(0);

  const clickPunchDataRef = useRef<{ x: number; y: number } | null>(null);

  const debounce = <F extends (...args: unknown[]) => unknown>(
    func: F,
    waitFor: number
  ) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
      new Promise((resolve) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(
          () => resolve(func(...args) as ReturnType<F>),
          waitFor
        );
      });
  };

  useEffect(() => {
    console.log("Effect 1: Initiating image preloading for /banner-hero.png");
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    const handlePreloadSuccess = () => {
      console.log("Image preloaded successfully.");
      setImageLoaded(true);
      setIsLoading(false);
    };
    const handlePreloadError = (e: string | Event) => {
      console.error("Error preloading image.", e);
      setImageLoaded(false);
      setIsLoading(false);
    };
    img.onload = handlePreloadSuccess;
    img.onerror = handlePreloadError;
    img.src = "/banner-hero.png";
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const currentImageElement = imageRef.current;
    if (currentImageElement) {
      if (imageLoaded) {
        const targetSrc = "/banner-hero.png";
        if (!currentImageElement.src.endsWith(targetSrc)) {
          currentImageElement.src = targetSrc;
        }
        const ensureImageRefIsProcessed = () => {
          if (
            currentImageElement.complete &&
            currentImageElement.naturalWidth > 0
          ) {
            setupImageData();
          } else {
            const tempOnload = () => {
              setupImageData();
              currentImageElement.removeEventListener("load", tempOnload);
              currentImageElement.removeEventListener("error", tempOnError);
            };
            const tempOnError = () => {
              console.error(
                "Error loading src into imageRef.current even after preload."
              );
              currentImageElement.removeEventListener("load", tempOnload);
              currentImageElement.removeEventListener("error", tempOnError);
            };
            currentImageElement.addEventListener("load", tempOnload);
            currentImageElement.addEventListener("error", tempOnError);
            if (
              currentImageElement.complete &&
              currentImageElement.naturalWidth > 0
            )
              tempOnload();
          }
        };
        ensureImageRefIsProcessed();
      } else {
      }
    } else if (!isLoading) {
      console.error("imageRef.current is null.");
    }
  }, [isLoading, imageLoaded]);

  const setupImageData = () => {
    if (
      !canvasRef.current ||
      !imageRef.current ||
      !imageLoaded ||
      !imageRef.current.complete ||
      imageRef.current.naturalWidth === 0
    ) {
      setTimeout(setupImageData, 100);
      return;
    }
    const canvas = canvasRef.current;
    if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) {
      setTimeout(setupImageData, 100);
      return;
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
    if (!tempCtx) return;

    const img = imageRef.current;
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const canvasAspectRatio = canvas.width / canvas.height;
    let renderWidth, renderHeight, offsetX, offsetY;

    if (imgAspectRatio > canvasAspectRatio) {
      renderHeight = canvas.height;
      renderWidth = renderHeight * imgAspectRatio;
      offsetX = (canvas.width - renderWidth) / 2;
      offsetY = 0;
    } else {
      renderWidth = canvas.width;
      renderHeight = renderWidth / imgAspectRatio;
      offsetX = 0;
      offsetY = (canvas.height - renderHeight) / 2;
    }

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

    try {
      imageDataRef.current = tempCtx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      createAllParticles();

      isWhirlpoolActiveRef.current = true;
      particleReturnForceStrengthRef.current = 0;
      console.log(
        `Whirlpool activated. Starting ${
          WHIRLPOOL_DURATION / 1000
        }-second timer.`
      );

      if (animationStopTimerRef.current)
        clearTimeout(animationStopTimerRef.current);
      animationStopTimerRef.current = setTimeout(() => {
        console.log(
          `${
            WHIRLPOOL_DURATION / 1000
          }-second timer expired. Deactivating whirlpool, enabling return.`
        );
        isWhirlpoolActiveRef.current = false;
        particleReturnForceStrengthRef.current = 0.02;
      }, WHIRLPOOL_DURATION);

      if (animationRef.current === 0) animate();
    } catch (error) {
      console.error("Error in setupImageData (getImageData):", error);
    }
  };

  const createAllParticles = () => {
    if (
      !imageDataRef.current ||
      !canvasRef.current ||
      canvasRef.current.width === 0
    ) {
      return;
    }
    const canvas = canvasRef.current;
    const imageData = imageDataRef.current;
    const data = imageData.data;
    particles.current = [];
    const step = Math.max(
      1,
      Math.floor(Math.min(canvas.width, canvas.height) / 120)
    );
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const currentX = Math.floor(x);
        const currentY = Math.floor(y);
        if (currentX >= canvas.width || currentY >= canvas.height) continue;

        const index = (currentY * canvas.width + currentX) * 4;
        if (index + 3 >= data.length) continue;

        const pixelAlpha = data[index + 3];

        if (pixelAlpha > 30) {
          const rOrig = data[index];
          const gOrig = data[index + 1];
          const bOrig = data[index + 2];

          const r = Math.min(
            255,
            Math.floor(rOrig * PARTICLE_BRIGHTNESS_FACTOR)
          );
          const g = Math.min(
            255,
            Math.floor(gOrig * PARTICLE_BRIGHTNESS_FACTOR)
          );
          const b = Math.min(
            255,
            Math.floor(bOrig * PARTICLE_BRIGHTNESS_FACTOR)
          );

          const baseSize = Math.max(1.0, step / 3.5);
          const randomSizeFactor = 0.75 + Math.random() * 0.5;
          const particle: Particle = {
            x: x,
            y: y,
            originalX: x,
            originalY: y,
            color: `rgb(${r}, ${g}, ${b})`,
            size: baseSize * randomSizeFactor,
            alpha: Math.min(1, (pixelAlpha / 255) * 1.2),
            vx: 0,
            vy: 0,
            mass: 0.7 + Math.random() * 0.6,
          };
          particles.current.push(particle);
        }
      }
    }
    console.log(
      `Created ${particles.current.length} particles. Step: ${step}, Brightness: ${PARTICLE_BRIGHTNESS_FACTOR}`
    );
  };

  const animate = () => {
    if (!canvasRef.current || canvasRef.current.width === 0) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const interactionRadius = 50;
    const damping = 0.4;
    const returnDamping = 0.93;
    if (isWhirlpoolActiveRef.current) {
      whirlpoolAnimationTime.current += -0.8;
    }
    const whirlpoolOrbitRadius = 1.5;
    const staticCenterX = canvas.width / 2;
    const staticCenterY = canvas.height / 2.2;
    const whirlpoolCenterX =
      staticCenterX +
      whirlpoolOrbitRadius * Math.cos(whirlpoolAnimationTime.current);
    const whirlpoolCenterY =
      staticCenterY +
      whirlpoolOrbitRadius * Math.sin(whirlpoolAnimationTime.current);

    const blackHoleAttraction = 0.035;
    const swirlStrength = 3.5;
    const blackHoleEffectRadius = Math.max(canvas.width, canvas.height) * 1.2;
    if (clickPunchDataRef.current) {
      const clickX = clickPunchDataRef.current.x;
      const clickY = clickPunchDataRef.current.y;
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        const dxClick = p.x - clickX;
        const dyClick = p.y - clickY;
        const distSqClick = dxClick * dxClick + dyClick * dyClick;

        if (
          distSqClick < CLICK_PUNCH_RADIUS * CLICK_PUNCH_RADIUS &&
          distSqClick > 0.001
        ) {
          const distClick = Math.sqrt(distSqClick);
          const forceFactor =
            (CLICK_PUNCH_RADIUS - distClick) / CLICK_PUNCH_RADIUS;
          const impulseX =
            (dxClick / distClick) * CLICK_PUNCH_STRENGTH * forceFactor;
          const impulseY =
            (dyClick / distClick) * CLICK_PUNCH_STRENGTH * forceFactor;

          p.vx += impulseX / p.mass;
          p.vy += impulseY / p.mass;
        }
      }
      clickPunchDataRef.current = null;
    }

    for (let i = 0; i < particles.current.length; i++) {
      const particle = particles.current[i];

      if (isWhirlpoolActiveRef.current) {
        const dxToWhirlpool = whirlpoolCenterX - particle.x;
        const dyToWhirlpool = whirlpoolCenterY - particle.y;
        const distSqToWhirlpool =
          dxToWhirlpool * dxToWhirlpool + dyToWhirlpool * dyToWhirlpool;

        if (
          distSqToWhirlpool < blackHoleEffectRadius * blackHoleEffectRadius &&
          distSqToWhirlpool > 1
        ) {
          const distToWhirlpool = Math.sqrt(distSqToWhirlpool);
          const normalizedDistanceInRadius =
            distToWhirlpool / blackHoleEffectRadius;
          const forceMagnitude =
            (1 - normalizedDistanceInRadius) * (1 - normalizedDistanceInRadius);
          const pullX =
            (dxToWhirlpool / distToWhirlpool) *
            blackHoleAttraction *
            forceMagnitude;
          const pullY =
            (dyToWhirlpool / distToWhirlpool) *
            blackHoleAttraction *
            forceMagnitude;
          particle.vx += pullX / particle.mass;
          particle.vy += pullY / particle.mass;

          const swirlX =
            (-dyToWhirlpool / distToWhirlpool) * swirlStrength * forceMagnitude;
          const swirlY =
            (dxToWhirlpool / distToWhirlpool) * swirlStrength * forceMagnitude;
          particle.vx += swirlX / particle.mass;
          particle.vy += swirlY / particle.mass;
        }
      }

      const dxMouse = mousePos.current.x - particle.x;
      const dyMouse = mousePos.current.y - particle.y;
      const distSqMouse = dxMouse * dxMouse + dyMouse * dyMouse;

      if (
        distSqMouse < interactionRadius * interactionRadius &&
        distSqMouse > 0.001
      ) {
        const distanceMouse = Math.sqrt(distSqMouse);
        const force = (interactionRadius - distanceMouse) / interactionRadius;
        particle.vx -=
          ((dxMouse / distanceMouse) * force * 2.0) / particle.mass;
        particle.vy -=
          ((dyMouse / distanceMouse) * force * 2.0) / particle.mass;
      }

      if (!isWhirlpoolActiveRef.current) {
        particle.vx +=
          ((particle.originalX - particle.x) *
            particleReturnForceStrengthRef.current) /
          particle.mass;
        particle.vy +=
          ((particle.originalY - particle.y) *
            particleReturnForceStrengthRef.current) /
          particle.mass;
      }

      if (isWhirlpoolActiveRef.current) {
        particle.vx *= damping;
        particle.vy *= damping;
      } else {
        particle.vx *= returnDamping;
        particle.vy *= returnDamping;
        const distToOriginalSq =
          (particle.originalX - particle.x) ** 2 +
          (particle.originalY - particle.y) ** 2;
        const velocitySq = particle.vx ** 2 + particle.vy ** 2;
        if (distToOriginalSq < 0.25 && velocitySq < 0.05) {
          particle.x = particle.originalX;
          particle.y = particle.originalY;
          particle.vx = 0;
          particle.vy = 0;
        }
      }

      particle.x += particle.vx;
      particle.y += particle.vy;

      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.fillRect(
        particle.x - particle.size / 2,
        particle.y - particle.size / 2,
        particle.size,
        particle.size
      );
    }
    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    clickPunchDataRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    console.log("Punch triggered at:", clickPunchDataRef.current);
  };

  const debouncedSetupImageDataRef = useRef(debounce(setupImageData, 300));

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && imageLoaded && particles.current.length > 0) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
        debouncedSetupImageDataRef.current();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (animationStopTimerRef.current)
        clearTimeout(animationStopTimerRef.current);
    };
  }, [imageLoaded]);

  if (isLoading) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-white border-r-white/30 border-b-white/30 border-l-white/30 rounded-full animate-spin"></div>
          <p className="text-white text-lg font-['Inter']">
            Cargando Partículas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center text-white overflow-hidden bg-[#000010]">
      <div
        className="absolute inset-0 cursor-pointer z-10"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <img
          ref={imageRef}
          style={{ display: "none" }}
          alt="Hidden reference for particle generation"
          crossOrigin="anonymous"
        />
      </div>
      <div className="absolute z-20 flex flex-col items-center pointer-events-none"></div>
    </div>
  );
};

export default Hero;
