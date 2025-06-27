import Hero from "./components/Hero";
import Coleccion from "./components/Coleccion";
import Contacto from "./components/Contacto";
import OilPaintingPortal from "./portals/oilPainting";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Coleccion />
        <Contacto />
      </main>
      <OilPaintingPortal />
    </>
  );
}
