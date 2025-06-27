import React from "react";

interface HeroLayoutProps {
  isAnimationComplete: boolean;
  fadeProgress: number;
}

const HeroLayout: React.FC<HeroLayoutProps> = ({
  isAnimationComplete,
  fadeProgress,
}) => {
  const shouldShowButtons = fadeProgress > 0.2;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/2 w-96 h-96 bg-gradient-radial from-yellow-100/10 via-yellow-200/5 to-transparent rounded-full blur-3xl transition-all duration-1500 ${
            isAnimationComplete ? "opacity-100 scale-150" : "opacity-0 scale-75"
          }`}
          style={{
            transform: isAnimationComplete
              ? "translateX(-50%) translateY(-10%) rotate(180deg)"
              : "translateX(-50%) translateY(-30%) rotate(0deg)",
            transitionDelay: "0.2s",
          }}
        />

        <div
          className={`absolute bottom-0 right-0 w-64 h-64 bg-gradient-radial from-blue-100/8 via-purple-200/4 to-transparent rounded-full blur-2xl transition-all duration-2000 ${
            isAnimationComplete ? "opacity-100 scale-200" : "opacity-0 scale-50"
          }`}
          style={{
            transform: isAnimationComplete
              ? "translate(-20%, -20%) rotate(-90deg)"
              : "translate(10%, 10%) rotate(0deg)",
            transitionDelay: "0.3s",
          }}
        />
      </div>

      <nav
        className={`absolute top-8 right-8 flex gap-8 text-lg z-20 transition-all duration-600 ${
          isAnimationComplete
            ? "opacity-100 translate-y-0 rotate-0"
            : "opacity-0 -translate-y-4 rotate-3"
        }`}
        style={{
          color: "#f8edbd",
          transitionDelay: isAnimationComplete ? "0.1s" : "0s",
          filter: isAnimationComplete
            ? "drop-shadow(0 0 20px rgba(248, 237, 189, 0.3))"
            : "none",
        }}
      >
        {[
          { label: "Inicio", href: "#" },
          { label: "Colección", href: "#colección" },
          { label: "Contacto", href: "#contacto" },
        ].map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className="hover:text-gray-300 transition-all duration-300 relative group overflow-hidden"
            style={{
              transitionDelay: isAnimationComplete
                ? `${0.15 + index * 0.05}s`
                : "0s",
            }}
          >
            <span className="relative z-10">{item.label}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-200 to-yellow-100 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </a>
        ))}
      </nav>

      <div
        className={`absolute right-10 top-1/2 transform -translate-y-1/2 text-right max-w-2xl z-20 transition-all duration-800 ${
          isAnimationComplete
            ? "opacity-100 translate-x-0 rotate-0"
            : "opacity-0 translate-x-8 rotate-1"
        }`}
        style={{
          color: "#f8edbd",
          transitionDelay: isAnimationComplete ? "0.2s" : "0s",
          filter: isAnimationComplete
            ? "drop-shadow(0 0 30px rgba(248, 237, 189, 0.2))"
            : "none",
        }}
      >
        <h1 className="text-6xl md:text-8xl font-light mb-6 relative overflow-hidden">
          <span
            className={`inline-block transition-all duration-800 ${
              isAnimationComplete
                ? "transform translate-y-0 opacity-100"
                : "transform translate-y-full opacity-0"
            }`}
            style={{ transitionDelay: isAnimationComplete ? "0.3s" : "0s" }}
          >
            Galaxia
          </span>
          <span className="mx-4" />
          <span
            className={`inline-block transition-all duration-800 ${
              isAnimationComplete
                ? "transform translate-y-0 opacity-100"
                : "transform translate-y-full opacity-0"
            }`}
            style={{ transitionDelay: isAnimationComplete ? "0.4s" : "0s" }}
          >
            al
          </span>
          <span className="mx-4" />
          <span
            className={`inline-block transition-all duration-800 ${
              isAnimationComplete
                ? "transform translate-y-0 opacity-100"
                : "transform translate-y-full opacity-0"
            }`}
            style={{ transitionDelay: isAnimationComplete ? "0.5s" : "0s" }}
          >
            óleo
          </span>

          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-100/20 to-transparent opacity-0"
            style={{
              animationName: isAnimationComplete ? "shimmer" : "none",
              animationDuration: "2s",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDelay: "1s",
            }}
          />
        </h1>

        <p
          className={`text-xl md:text-2xl font-light transition-all duration-600 ${
            isAnimationComplete
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-4"
          }`}
          style={{ transitionDelay: isAnimationComplete ? "0.6s" : "0s" }}
        >
          Una mirada artística
          <br />
          al cosmos en cada trazo.
        </p>
      </div>

      <div
        className={`absolute bottom-20 left-20 flex gap-6 z-20 transition-all duration-1000 ${
          shouldShowButtons
            ? "opacity-100 translate-y-0 scale-100 rotate-0"
            : "opacity-0 translate-y-12 scale-95 rotate-2"
        }`}
        style={{
          transitionDelay: shouldShowButtons ? "0.2s" : "0s",
          transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <button className="relative px-12 py-4 rounded-lg text-xl overflow-hidden transform transition-all duration-500 hover:scale-110 hover:shadow-2xl group perspective-1000">
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
            Ver obras
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

        <button
          className="px-12 py-4 rounded-lg text-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl relative overflow-hidden group transform hover:-translate-y-2 perspective-1000"
          style={{
            border: "2px solid #f8edbd",
            color: "#f8edbd",
            backgroundColor: "transparent",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-100 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg transform group-hover:rotate-y-6" />

          <div className="absolute inset-0 border-2 border-yellow-200 rounded-lg scale-0 group-hover:scale-105 transition-all duration-500 group-hover:border-yellow-100" />

          <div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background:
                "conic-gradient(from 90deg, transparent, rgba(248, 237, 189, 0.1), transparent)",
              transform: "rotate(0deg)",
              animationName: "spin",
              animationDuration: "3s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDirection: "reverse",
            }}
          />

          <div
            className="absolute -inset-3 border border-yellow-200/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500"
            style={{
              animationName: "pulse",
              animationDuration: "2s",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          />

          <div
            className="absolute inset-0 bg-gradient-to-45 from-transparent via-yellow-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full group-hover:skew-x-12"
            style={{ transitionDuration: "800ms" }}
          />

          <span className="relative z-10 group-hover:text-black transition-colors duration-500 font-medium group-hover:drop-shadow-sm">
            Explorar más
          </span>

          <div className="absolute top-1/2 left-1/2 w-0 h-0 border-4 border-transparent group-hover:w-2 group-hover:h-2 group-hover:border-yellow-100 rounded-full transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
        </button>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0%,
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            transform: translateX(100%);
            opacity: 1;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .rotate-y-12 {
          transform: rotateY(12deg);
        }

        .rotate-y-6 {
          transform: rotateY(6deg);
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .bg-gradient-to-45 {
          background: linear-gradient(45deg, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default HeroLayout;
