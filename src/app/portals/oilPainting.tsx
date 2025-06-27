"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const OilPaintingPortal = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <svg
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <defs>
        <filter
          id="oil-painting-texture"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          <feTurbulence
            baseFrequency="2.5"
            numOctaves="6"
            result="noise1"
            seed="5"
            type="fractalNoise"
          />
          <feTurbulence
            baseFrequency="0.8"
            numOctaves="4"
            result="noise2"
            seed="12"
            type="turbulence"
          />
          <feBlend
            mode="multiply"
            in="noise1"
            in2="noise2"
            result="combined-noise"
          />
          <feColorMatrix in="combined-noise" type="saturate" values="0" />
          <feComponentTransfer result="roughness">
            <feFuncA
              type="discrete"
              tableValues="0.08 0.12 0.18 0.25 0.1 0.1 0.02 0.08"
            />
          </feComponentTransfer>
          <feGaussianBlur
            in="roughness"
            stdDeviation="0.3"
            result="soft-texture"
          />
          <feComposite
            operator="multiply"
            in="soft-texture"
            in2="SourceGraphic"
            result="textured"
          />
          <feComposite operator="over" in="textured" in2="SourceGraphic" />
        </filter>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="transparent"
        filter="url(#oil-painting-texture)"
      />
    </svg>,
    document.body
  );
};

export default OilPaintingPortal;
