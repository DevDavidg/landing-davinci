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
}

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false); // Tracks if the image *data* is successfully preloaded
  const [isLoading, setIsLoading] = useState(true); // Controls overall loading state (spinner vs. content)
  const mousePos = useRef({ x: 0, y: 0 });
  const imageDataRef = useRef<ImageData | null>(null);
  const whirlpoolAnimationTime = useRef(0); // To control the whirlpool's circular motion

  // Debounce function
  const debounce = <F extends (...args: any[]) => any>(
    func: F,
    waitFor: number
  ) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
      new Promise((resolve) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => resolve(func(...args)), waitFor);
      });
  };

  // Effect 1: Preload the image in memory
  useEffect(() => {
    console.log("Effect 1: Initiating image preloading for /banner-hero.png");
    const img = new window.Image();
    img.crossOrigin = "anonymous"; // Good practice for canvas operations

    const handlePreloadSuccess = () => {
      console.log(
        "Image preloaded successfully. Natural dimensions:",
        img.naturalWidth,
        img.naturalHeight
      );
      setImageLoaded(true); // Mark that image data is ready
      setIsLoading(false); // Stop showing the spinner, allow <img> tag to render
    };

    const handlePreloadError = (e: string | Event) => {
      console.error(
        "Error preloading image /banner-hero.png. Check path and public folder access.",
        e
      );
      setImageLoaded(false); // Mark that image data is not ready
      setIsLoading(false); // Stop showing the spinner, will show error/fallback
    };

    img.onload = handlePreloadSuccess;
    img.onerror = handlePreloadError;

    img.src = "/banner-hero.png"; // Start preloading (ensure this path is correct in your public folder)

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []); // Runs once on mount to initiate preloading.

  // Effect 2: Handle the actual <img> tag once it's rendered and preloading is done
  useEffect(() => {
    console.log(
      `Effect 2: isLoading: ${isLoading}, imageLoaded: ${imageLoaded}`
    );
    if (isLoading) {
      return;
    }

    const currentImageElement = imageRef.current;

    if (currentImageElement) {
      if (imageLoaded) {
        const targetSrc = "/banner-hero.png";
        const currentSrcFull = currentImageElement.src;

        if (
          typeof currentSrcFull !== "string" ||
          !currentSrcFull.endsWith(targetSrc)
        ) {
          console.log(
            `Assigning preloaded image src ('${targetSrc}') to imageRef.current.`
          );
          currentImageElement.src = targetSrc;
        }

        const ensureImageRefIsProcessed = () => {
          if (
            currentImageElement.complete &&
            currentImageElement.naturalWidth > 0
          ) {
            console.log(
              "imageRef.current is complete. Calling setupImageData."
            );
            setupImageData();
          } else {
            console.log(
              "imageRef.current not immediately complete after src assignment. Attaching temporary listeners."
            );

            const tempOnload = () => {
              console.log(
                "imageRef.current has loaded its src. Calling setupImageData."
              );
              setupImageData();
              currentImageElement.removeEventListener("load", tempOnload);
              currentImageElement.removeEventListener("error", tempOnError);
            };
            const tempOnError = () => {
              console.error(
                "Error occurred while imageRef.current was loading its src, even after successful preload."
              );
              if (canvasRef.current) {
                // Draw error message on canvas
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  canvas.width = canvas.offsetWidth || window.innerWidth;
                  canvas.height = canvas.offsetHeight || window.innerHeight;
                  ctx.fillStyle = "white";
                  ctx.textAlign = "center";
                  ctx.font = "20px Inter";
                  ctx.fillText(
                    "Error: Image could not be loaded onto hidden img tag.",
                    canvas.width / 2,
                    canvas.height / 2
                  );
                }
              }
              currentImageElement.removeEventListener("load", tempOnload);
              currentImageElement.removeEventListener("error", tempOnError);
            };
            currentImageElement.addEventListener("load", tempOnload);
            currentImageElement.addEventListener("error", tempOnError);

            if (
              currentImageElement.complete &&
              currentImageElement.naturalWidth > 0
            ) {
              console.log(
                "Fallback: imageRef.current was already complete. Calling setupImageData."
              );
              tempOnload(); // Call it directly if already complete by now
            }
          }
        };
        ensureImageRefIsProcessed();
      } else {
        console.error(
          "Image preloading failed. Displaying error message on canvas."
        );
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = canvas.offsetWidth || window.innerWidth;
            canvas.height = canvas.offsetHeight || window.innerHeight;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = "20px Inter";
            ctx.fillText(
              "Error: Image could not be preloaded.",
              canvas.width / 2,
              canvas.height / 2
            );
          }
        }
      }
    } else if (!isLoading) {
      console.error(
        "imageRef.current is null even when isLoading is false. Check component structure."
      );
    }
  }, [isLoading, imageLoaded]); // Dependencies ensure this runs when loading state or image readiness changes.

  const setupImageData = () => {
    if (!canvasRef.current) {
      console.warn("setupImageData: canvasRef is null.");
      return;
    }
    if (!imageRef.current) {
      console.warn("setupImageData: imageRef is null.");
      return;
    }
    if (!imageLoaded) {
      console.warn("setupImageData: Preload flag 'imageLoaded' is false.");
      return;
    }
    if (!imageRef.current.complete || imageRef.current.naturalWidth === 0) {
      console.warn(
        "setupImageData: imageRef.current is not complete or has no dimensions yet.",
        "Complete:",
        imageRef.current.complete,
        "NaturalWidth:",
        imageRef.current.naturalWidth
      );
      // Retry if image not fully processed by the browser yet
      setTimeout(setupImageData, 100);
      return;
    }
    console.log(
      "setupImageData: All checks passed. Proceeding to process image data."
    );

    const canvas = canvasRef.current;
    if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) {
      console.warn(
        "setupImageData: Canvas has zero dimensions. Retrying shortly."
      );
      setTimeout(setupImageData, 100); // Retry if canvas not laid out yet
      return;
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
    if (!tempCtx) {
      console.error("Failed to get 2D context for temporary canvas.");
      return;
    }

    const img = imageRef.current;
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const canvasAspectRatio = canvas.width / canvas.height;
    let renderWidth, renderHeight, offsetX, offsetY;

    // Calculate dimensions to maintain aspect ratio (cover logic)
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
      console.log("Image data processed successfully for particles.");
      createAllParticles();
      if (animationRef.current === 0) {
        animate();
      }
    } catch (error) {
      console.error(
        "Error in setupImageData while getting image data (CORS issue if image source is external and not configured, or other security restriction):",
        error
      );
      const mainCtx = canvas.getContext("2d");
      if (mainCtx) {
        mainCtx.fillStyle = "rgba(0,0,0,0.7)";
        mainCtx.fillRect(0, 0, canvas.width, canvas.height);
        mainCtx.fillStyle = "white";
        mainCtx.textAlign = "center";
        mainCtx.font = "16px Inter";
        mainCtx.fillText(
          "Could not process image for particles.",
          canvas.width / 2,
          canvas.height / 2
        );
        mainCtx.fillText(
          "Check console for (CORS) errors.",
          canvas.width / 2,
          canvas.height / 2 + 20
        );
      }
    }
  };

  const createAllParticles = () => {
    if (
      !imageDataRef.current ||
      !canvasRef.current ||
      canvasRef.current.width === 0 ||
      canvasRef.current.height === 0
    ) {
      console.warn(
        "createAllParticles: Missing data or zero canvas dimensions."
      );
      return;
    }

    const canvas = canvasRef.current;
    const imageData = imageDataRef.current;
    const data = imageData.data;

    particles.current = [];
    // Adjust step for particle density. Lower value = more particles.
    const step = Math.max(
      1,
      Math.floor(Math.min(canvas.width, canvas.height) / 100) // Increased denominator for potentially more particles
    );

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const currentX = Math.floor(x);
        const currentY = Math.floor(y);
        if (currentX >= canvas.width || currentY >= canvas.height) continue;

        const index = (currentY * canvas.width + currentX) * 4;
        if (index + 3 >= data.length) continue; // Boundary check

        const pixelAlpha = data[index + 3];

        if (pixelAlpha > 30) {
          // Threshold for considering a pixel part of the image
          const rOrig = data[index];
          const gOrig = data[index + 1];
          const bOrig = data[index + 2];

          const brightnessFactor = 1.15; // Slightly brighten particles
          const r = Math.min(255, Math.floor(rOrig * brightnessFactor));
          const g = Math.min(255, Math.floor(gOrig * brightnessFactor));
          const b = Math.min(255, Math.floor(bOrig * brightnessFactor));

          const particle: Particle = {
            x: x,
            y: y,
            originalX: x,
            originalY: y,
            color: `rgb(${r}, ${g}, ${b})`,
            size: Math.max(1.2, step / 3.8), // Particle size relative to step
            alpha: Math.min(1, (pixelAlpha / 255) * 1.1), // Particle alpha based on pixel alpha
            vx: 0,
            vy: 0,
          };
          particles.current.push(particle);
        }
      }
    }
    console.log(
      `Created ${particles.current.length} particles with step ${step}.`
    );
  };

  const animate = () => {
    if (
      !canvasRef.current ||
      canvasRef.current.width === 0 ||
      canvasRef.current.height === 0
    ) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const interactionRadius = 40;
    const returnForceStrength = 0;
    const damping = 0.3;

    // Whirlpool center animation properties
    whirlpoolAnimationTime.current += -1; // Speed of the orbit; adjust as needed
    const whirlpoolOrbitRadius = 1; // Radius of the circle the whirlpool center makes; adjust as needed
    const staticCenterX = canvas.width / 2;
    const staticCenterY = canvas.height / 2.3;

    // Calculate the moving center of the whirlpool
    const whirlpoolCenterX =
      staticCenterX +
      whirlpoolOrbitRadius * Math.cos(whirlpoolAnimationTime.current);
    const whirlpoolCenterY =
      staticCenterY +
      whirlpoolOrbitRadius * Math.sin(whirlpoolAnimationTime.current);

    // Black hole / Whirlpool properties (relative to the moving whirlpool center)
    const blackHoleAttraction = 0.03; // Strength of pull towards the whirlpool center
    const swirlStrength = 3; // Strength of the swirling motion
    const blackHoleEffectRadius = 1920; // Radius for the whirlpool effect around its moving center

    for (let i = 0; i < particles.current.length; i++) {
      const particle = particles.current[i];

      // --- Whirlpool Effect (around the moving whirlpoolCenter) ---
      const dxToWhirlpool = whirlpoolCenterX - particle.x;
      const dyToWhirlpool = whirlpoolCenterY - particle.y;
      const distSqToWhirlpool =
        dxToWhirlpool * dxToWhirlpool + dyToWhirlpool * dyToWhirlpool;
      const distToWhirlpool = Math.sqrt(distSqToWhirlpool);

      // Apply whirlpool effect only if the particle is within the blackHoleEffectRadius of the moving center
      if (distToWhirlpool < blackHoleEffectRadius && distToWhirlpool > 1) {
        const normalizedDistanceInRadius =
          distToWhirlpool / blackHoleEffectRadius;
        const forceMagnitude = 1 - normalizedDistanceInRadius;

        // Attraction force (pulls particle towards the moving whirlpool center)
        const pullX =
          (dxToWhirlpool / distToWhirlpool) *
          blackHoleAttraction *
          forceMagnitude;
        const pullY =
          (dyToWhirlpool / distToWhirlpool) *
          blackHoleAttraction *
          forceMagnitude;
        particle.vx += pullX;
        particle.vy += pullY;

        // Swirl force (tangential force, creates the whirlpool motion around the moving center)
        const swirlX =
          (-dyToWhirlpool / distToWhirlpool) * swirlStrength * forceMagnitude;
        const swirlY =
          (dxToWhirlpool / distToWhirlpool) * swirlStrength * forceMagnitude;
        particle.vx += swirlX;
        particle.vy += swirlY;
      }
      // --- End Whirlpool Effect ---

      // Mouse interaction (pushes particles away from actual mouse)
      const dxMouse = mousePos.current.x - particle.x;
      const dyMouse = mousePos.current.y - particle.y;
      const distSqMouse = dxMouse * dxMouse + dyMouse * dyMouse;

      if (distSqMouse < interactionRadius * interactionRadius) {
        const distanceMouse = Math.sqrt(distSqMouse);
        if (distanceMouse > 0) {
          const force = (interactionRadius - distanceMouse) / interactionRadius;
          particle.vx -= (dxMouse / distanceMouse) * force * 1.5;
          particle.vy -= (dyMouse / distanceMouse) * force * 1.5;
        }
      }

      // Force to return to original position
      particle.vx += (particle.originalX - particle.x) * returnForceStrength;
      particle.vy += (particle.originalY - particle.y) * returnForceStrength;

      // Apply damping
      particle.vx *= damping;
      particle.vy *= damping;

      // Update particle position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Draw particle
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.fillRect(
        particle.x - particle.size / 2,
        particle.y - particle.size / 2,
        particle.size,
        particle.size
      );
    }
    ctx.globalAlpha = 1; // Reset globalAlpha

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const debouncedSetupImageDataRef = useRef(debounce(setupImageData, 300));

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && imageLoaded && particles.current.length > 0) {
        console.log("Resize detected. Re-initializing particles.");
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = 0;
        }
        debouncedSetupImageDataRef.current();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
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
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <img
          ref={imageRef}
          style={{ display: "none" }}
          alt="Hidden reference for particle generation"
          crossOrigin="anonymous"
        />
      </div>
      <div className="absolute z-20 flex flex-col items-center pointer-events-none">
        {/* You can add text or other UI elements here if needed */}
      </div>
    </div>
  );
};

export default Hero;
