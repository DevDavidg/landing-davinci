"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Artwork {
  id: number;
  title: string;
  description: string;
  dimensions: string;
  year: string;
  image: string;
  price?: string;
}

const artworks: Artwork[] = [
  {
    id: 1,
    title: "Nebulosa de Andrómeda",
    description:
      "Una interpretación pictórica de la galaxia más cercana a la Vía Láctea",
    dimensions: "120x80 cm",
    year: "2025",
    image: "/banner-hero.png",
    price: "$1,200",
  },
  {
    id: 2,
    title: "Constelación del Cisne",
    description: "Los colores vibrantes de una región de formación estelar",
    dimensions: "100x70 cm",
    year: "2025",
    image: "/banner-hero.png",
    price: "$950",
  },
  {
    id: 3,
    title: "Planeta Dorado",
    description: "Un mundo exótico bañado en luz dorada y misterio",
    dimensions: "90x60 cm",
    year: "2025",
    image: "/banner-hero.png",
    price: "$800",
  },
  {
    id: 4,
    title: "Tormenta Solar",
    description: "La danza magnética de las partículas solares",
    dimensions: "150x100 cm",
    year: "2025",
    image: "/banner-hero.png",
    price: "$1,500",
  },
  {
    id: 5,
    title: "Galaxia Espiral",
    description: "Los brazos dorados de una galaxia en rotación",
    dimensions: "110x80 cm",
    year: "2025",
    image: "/banner-hero.png",
    price: "$1,100",
  },
  {
    id: 6,
    title: "Cúmulo Estelar",
    description: "Un grupo de estrellas jóvenes iluminando el cosmos",
    dimensions: "80x60 cm",
    year: "2025",
    image: "/banner-hero.png",
    price: "$750",
  },
];

const Coleccion: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("colección");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
  };

  return (
    <section
      id="colección"
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
            Cada obra captura la magnificencia del cosmos, desde nebulosas
            distantes hasta galaxias en espiral, transformando la ciencia
            astronómica en arte visual.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {artworks.map((artwork, index) => (
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
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {artwork.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{artwork.dimensions}</span>
                    <span className="text-gray-500">{artwork.year}</span>
                  </div>
                  {artwork.price && (
                    <div className="mt-4 text-right">
                      <span
                        className="text-xl font-medium"
                        style={{ color: "#f8edbd" }}
                      >
                        {artwork.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            className={`relative px-16 py-5 rounded-lg text-xl overflow-hidden transform transition-all duration-800 hover:scale-110 hover:shadow-2xl group perspective-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: "1.2s",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 rounded-lg transition-all duration-500 group-hover:from-yellow-100 group-hover:via-yellow-50 group-hover:to-yellow-100" />

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-all duration-700 transform skew-x-12 -translate-x-full group-hover:translate-x-full" />

            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-200/20 via-yellow-100/20 to-yellow-200/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <span className="relative text-black font-medium z-10 transition-all duration-300 group-hover:drop-shadow-sm">
              Ver Colección Completa
            </span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-yellow-200/30">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-yellow-200 transition-colors duration-300 z-10"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="flex flex-col justify-center">
                <h3
                  className="text-4xl font-light mb-4"
                  style={{ color: "#f8edbd" }}
                >
                  {selectedArtwork.title}
                </h3>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  {selectedArtwork.description}
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dimensiones:</span>
                    <span className="text-gray-200">
                      {selectedArtwork.dimensions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Año:</span>
                    <span className="text-gray-200">
                      {selectedArtwork.year}
                    </span>
                  </div>
                  {selectedArtwork.price && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Precio:</span>
                      <span
                        className="text-2xl font-medium"
                        style={{ color: "#f8edbd" }}
                      >
                        {selectedArtwork.price}
                      </span>
                    </div>
                  )}
                </div>

                <button className="w-full py-4 rounded-lg text-lg font-medium bg-gradient-to-r from-yellow-200 to-yellow-100 text-black hover:from-yellow-100 hover:to-yellow-50 transition-all duration-300 transform hover:scale-105">
                  Consultar Disponibilidad
                </button>
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
      `}</style>
    </section>
  );
};

export default Coleccion;
