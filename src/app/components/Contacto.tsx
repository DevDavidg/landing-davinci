"use client";
import React, { useState, useEffect } from "react";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contacto: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("contacto");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmitMessage("¡Gracias por tu mensaje! Te contactaré pronto.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);

    setTimeout(() => setSubmitMessage(""), 5000);
  };

  return (
    <section
      id="contacto"
      className="min-h-screen bg-gradient-to-br from-[#000010] via-[#0a0a1a] to-[#000010] relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/3 right-1/3 w-80 h-80 bg-gradient-radial from-yellow-100/12 via-yellow-200/6 to-transparent rounded-full blur-3xl transition-all duration-2000 ${
            isVisible ? "opacity-100 scale-150" : "opacity-0 scale-75"
          }`}
          style={{
            transform: isVisible ? "rotate(-30deg)" : "rotate(0deg)",
            transitionDelay: "0.4s",
          }}
        />
        <div
          className={`absolute bottom-1/3 left-1/3 w-60 h-60 bg-gradient-radial from-blue-100/8 via-purple-200/4 to-transparent rounded-full blur-3xl transition-all duration-2500 ${
            isVisible ? "opacity-100 scale-200" : "opacity-0 scale-50"
          }`}
          style={{
            transform: isVisible ? "rotate(120deg)" : "rotate(0deg)",
            transitionDelay: "0.6s",
          }}
        />

        {/* Floating elements */}
        <div
          className={`absolute top-20 left-10 w-2 h-2 bg-yellow-200/60 rounded-full transition-all duration-3000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: "1s",
            animationName: isVisible ? "float" : "none",
            animationDuration: "6s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
        <div
          className={`absolute top-1/2 right-20 w-1 h-1 bg-blue-200/40 rounded-full transition-all duration-3000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: "1.5s",
            animationName: isVisible ? "float" : "none",
            animationDuration: "8s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: "2s",
          }}
        />
      </div>

      <div className="container mx-auto px-8 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
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
            Contacto
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
            ¿Interesado en una obra o tienes alguna pregunta? Me encantaría
            escuchar de ti. Cada pieza puede ser personalizada según tu visión
            del cosmos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Information */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
            style={{ transitionDelay: "0.6s" }}
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-200/10 to-yellow-100/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative p-6 border border-yellow-200/20 rounded-lg hover:border-yellow-200/40 transition-colors duration-500">
                <h3
                  className="text-2xl font-light mb-4"
                  style={{ color: "#f8edbd" }}
                >
                  Información de Contacto
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-200/20 to-yellow-100/20 flex items-center justify-center">
                      <svg
                        className="w-6 h-6"
                        style={{ color: "#f8edbd" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-gray-200">
                        artista@galaxiaaleoleo.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-200/20 to-yellow-100/20 flex items-center justify-center">
                      <svg
                        className="w-6 h-6"
                        style={{ color: "#f8edbd" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Teléfono</p>
                      <p className="text-gray-200">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-200/20 to-yellow-100/20 flex items-center justify-center">
                      <svg
                        className="w-6 h-6"
                        style={{ color: "#f8edbd" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Estudio</p>
                      <p className="text-gray-200">Argentina</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200/10 to-purple-100/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative p-6 border border-yellow-200/20 rounded-lg hover:border-yellow-200/40 transition-colors duration-500">
                <h3
                  className="text-2xl font-light mb-4"
                  style={{ color: "#f8edbd" }}
                >
                  Horarios de Atención
                </h3>
                <div className="space-y-2 text-gray-200">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes</span>
                    <span>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados</span>
                    <span>10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingos</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "0.8s" }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 rounded-lg bg-transparent border border-yellow-200/30 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-yellow-200 transition-colors duration-300"
                    placeholder="Tu nombre"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-200/5 to-yellow-100/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 rounded-lg bg-transparent border border-yellow-200/30 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-yellow-200 transition-colors duration-300"
                    placeholder="Tu email"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-200/5 to-yellow-100/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 rounded-lg bg-transparent border border-yellow-200/30 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-yellow-200 transition-colors duration-300"
                  placeholder="Asunto"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-200/5 to-yellow-100/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              <div className="relative group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-4 rounded-lg bg-transparent border border-yellow-200/30 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-yellow-200 transition-colors duration-300 resize-none"
                  placeholder="Tu mensaje..."
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-200/5 to-yellow-100/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative px-8 py-4 rounded-lg text-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl group perspective-1000 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 rounded-lg transition-all duration-500 group-hover:from-yellow-100 group-hover:via-yellow-50 group-hover:to-yellow-100" />

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-all duration-700 transform skew-x-12 -translate-x-full group-hover:translate-x-full" />

                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-200/20 via-yellow-100/20 to-yellow-200/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <span className="relative text-black font-medium z-10 transition-all duration-300 group-hover:drop-shadow-sm">
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </span>

                {isSubmitting && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  </div>
                )}
              </button>

              {submitMessage && (
                <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p style={{ color: "#f8edbd" }}>{submitMessage}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
};

export default Contacto;
