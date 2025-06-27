"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export interface Artwork {
  id: number;
  title: string;
  description: string;
  year: string;
  image: string;
}

interface ColeccionProps {
  onShowDemo: (artwork: Artwork) => void;
}

const artworks: Artwork[] = [
  {
    id: 1,
    title: "La Persistencia de la Memoria",
    description:
      "La persistencia de la memoria, de Salvador Dalí, es un óleo sobre lienzo que desafía la percepción del tiempo y la realidad con sus relojes blandos y un paisaje onírico.",
    year: "1931",
    image: "/cuadros/La persistencia de la memoria.jpg",
  },
  {
    id: 2,
    title: "Mona Lisa",
    description:
      "La Mona Lisa, de Leonardo da Vinci, es un retrato que cautiva por su enigmática sonrisa y la maestría técnica del sfumato, que difumina los contornos y crea una atmósfera de misterio.",
    year: "1503-1519",
    image: "/cuadros/mona lisa.jpg",
  },
  {
    id: 3,
    title: "Noche Estrellada",
    description:
      "La noche estrellada, de Vincent van Gogh, es una obra que expresa la intensa agitación emocional del artista a través de un cielo nocturno vibrante y un ciprés que se alza como una llama oscura.",
    year: "1889",
    image: "/cuadros/noche estrellada.jpg",
  },
  {
    id: 4,
    title: "Torre de Babel",
    description:
      "La Torre de Babel, de Pieter Bruegel el Viejo, es una representación de la ambición humana y su fragilidad, donde una multitud de pequeños detalles revela la complejidad de la construcción.",
    year: "1563",
    image: "/cuadros/torre de babel.jpg",
  },
  {
    id: 5,
    title: "Tributo de la Moneda",
    description:
      "El Tributo de la Moneda, de Masaccio, es un fresco que destaca por su uso revolucionario de la perspectiva y el realismo, narrando un pasaje bíblico con una gravedad y humanidad sin precedentes.",
    year: "c. 1425",
    image: "/cuadros/Tributo de la moneda.jpg",
  },
  {
    id: 6,
    title: "Vaca Amarilla",
    description:
      "La Vaca Amarilla, de Franz Marc, es una pintura que utiliza el color para transmitir emociones, representando a una vaca en tonos amarillos vibrantes que simbolizan la feminidad y la conexión con la naturaleza.",
    year: "1911",
    image: "/cuadros/Vaca amarilla.jpg",
  },
];

const Coleccion: React.FC<ColeccionProps> = ({ onShowDemo }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("coleccion");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleDemoClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    artwork: Artwork
  ) => {
    e.stopPropagation();
    onShowDemo(artwork);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
  };

  const visibleArtworks = showAll ? artworks : artworks.slice(0, 3);

  return (
    <section
      id="coleccion"
      className="min-h-screen bg-gradient-to-br from-[#000010] via-[#0a0a1a] to-[#000010] relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-yellow-100/8 via-yellow-200/4 to-transparent rounded-full blur-3xl transition-all duration-2000 ${
            isVisible ? "opacity-100 scale-150" : "opacity-0 scale-75"
          }`}
          style={{
            transform: isVisible ? "rotate(45deg)" : "rotate(0deg)",
            transitionDelay: "0.3s",
          }}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-blue-100/6 via-purple-200/3 to-transparent rounded-full blur-2xl transition-all duration-2500 ${
            isVisible ? "opacity-100 scale-200" : "opacity-0 scale-50"
          }`}
          style={{
            transform: isVisible ? "rotate(-60deg)" : "rotate(0deg)",
            transitionDelay: "0.5s",
          }}
        />
      </div>

      <div className="container mx-auto px-8 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2
            className={`text-6xl md:text-8xl font-light mb-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              color: "#f8edbd",
              filter: isVisible
                ? "drop-shadow(0 0 30px rgba(248, 237, 189, 0.3))"
                : "none",
              transitionDelay: "0.2s",
            }}
          >
            Colección
          </h2>
          <p
            className={`text-xl md:text-2xl font-light max-w-3xl mx-auto transition-all duration-800 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{
              color: "#f8edbd",
              transitionDelay: "0.4s",
            }}
          >
            Cada obra es una ventana a la historia del arte, un diálogo entre el
            genio creativo y su tiempo. Descubre los secretos detrás de las
            pinceladas maestras.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {visibleArtworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className={`relative group cursor-pointer transition-all duration-800 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{
                transitionDelay: `${0.6 + index * 0.1}s`,
              }}
              onMouseEnter={() => setHoveredId(artwork.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleArtworkClick(artwork)}
            >
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-black border border-yellow-200/20 hover:border-yellow-200/50 transition-all duration-500">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Demo Button */}
                  <button
                    onClick={(e) => handleDemoClick(e, artwork)}
                    className="absolute top-4 left-4 bg-black/50 text-white py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm border border-white/20 hover:bg-white/20 z-10"
                  >
                    Ver demo
                  </button>

                  {/* Hover Effects */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 border-2 border-yellow-200/50 rounded-lg scale-95 group-hover:scale-100 transition-transform duration-500" />
                    <div
                      className="absolute inset-0 bg-gradient-to-45 from-transparent via-yellow-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"
                      style={{ transitionDuration: "1000ms" }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className="text-2xl font-light mb-2 transition-colors duration-300"
                    style={{
                      color: hoveredId === artwork.id ? "#f8edbd" : "#d4d4d4",
                    }}
                  >
                    {artwork.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {artwork.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{artwork.year}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className={`relative px-16 py-5 rounded-lg text-xl overflow-hidden transform transition-all duration-800 hover:scale-110 hover:shadow-2xl group perspective-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: "1.2s",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 rounded-lg transition-all duration-500 group-hover:from-yellow-100 group-hover:via-yellow-50 group-hover:to-yellow-100 group-hover:rotate-y-12" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-all duration-700 transform skew-x-12 -translate-x-full group-hover:translate-x-full" />
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)",
                opacity: 0,
                animationName: "spin",
                animationDuration: "2s",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
              }}
            />
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-200/20 via-yellow-100/20 to-yellow-200/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative text-black font-medium z-10 transition-all duration-300 group-hover:drop-shadow-sm">
              {showAll ? "Ver menos" : "Ver colección completa"}
            </span>
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
                transform: "scale(0.8)",
                animationName: "pulse",
                animationDuration: "1.5s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
              }}
            />
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedArtwork && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 transition-opacity duration-300 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-[#0a0a1a] to-[#000010] rounded-lg shadow-2xl w-full max-w-6xl max-h-full overflow-y-auto flex flex-col relative border border-yellow-200/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-yellow-200 transition-colors duration-300 z-10"
              aria-label="Cerrar modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image */}
            <div className="w-full md:h-[70vh] h-[50vh] relative">
              <Image
                src={selectedArtwork.image}
                alt={selectedArtwork.title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <h3
                className="text-4xl font-light mb-4"
                style={{ color: "#f8edbd" }}
              >
                {selectedArtwork.title}
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                {selectedArtwork.description}
              </p>
              <div className="inline-block">
                <div className="flex justify-between">
                  <span className="text-gray-400 mr-4">Año:</span>
                  <span className="text-gray-200">{selectedArtwork.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .bg-gradient-to-45 {
          background: linear-gradient(45deg, var(--tw-gradient-stops));
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Coleccion;
