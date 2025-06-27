"use client";
import Hero from "./components/Hero";
import Coleccion, { Artwork } from "./components/Coleccion";
import Contacto from "./components/Contacto";
import OilPaintingPortal from "./portals/oilPainting";
import { useState } from "react";

export default function Home() {
  const [demoArtwork, setDemoArtwork] = useState<Artwork | null>(null);
  const [demoTrigger, setDemoTrigger] = useState(0);

  const handleShowDemo = (artwork: Artwork) => {
    const triggerAnimation = () => {
      setDemoArtwork(artwork);
      setDemoTrigger((prev) => prev + 1);
    };

    if (window.scrollY === 0) {
      triggerAnimation();
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });

    const scrollListener = () => {
      if (window.scrollY === 0) {
        window.removeEventListener("scroll", scrollListener);
        triggerAnimation();
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
  };

  const heroProps = demoArtwork
    ? {
        imageSrc: demoArtwork.image,
        title: demoArtwork.title,
        description: demoArtwork.description,
        isDemoMode: true,
      }
    : {};

  return (
    <>
      <main>
        <Hero key={demoTrigger} {...heroProps} />
        <Coleccion onShowDemo={handleShowDemo} />
        <Contacto />
      </main>
      <OilPaintingPortal />
    </>
  );
}
