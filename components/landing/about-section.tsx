"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { CheckCircle, Users, Target, Award } from "lucide-react"

const features = [
  "Equipo de expertos certificados",
  "Metodologias agiles de trabajo",
  "Soporte tecnico continuo",
  "Proyectos a medida",
  "Tecnologias modernas",
  "Precios competitivos",
]

const highlights = [
  {
    icon: Users,
    title: "Equipo Experto",
    description: "Profesionales con anos de experiencia en el sector tecnologico.",
  },
  {
    icon: Target,
    title: "Enfoque Personalizado",
    description: "Cada proyecto es unico y merece una solucion a medida.",
  },
  {
    icon: Award,
    title: "Calidad Garantizada",
    description: "Comprometidos con la excelencia en cada entrega.",
  },
]

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="nosotros" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-card/30" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className={`transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Sobre Nosotros
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-balance">
              Impulsamos la transformacion digital de tu negocio
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              En AIntegration combinamos creatividad, tecnologia y experiencia 
              para ofrecer soluciones informaticas que realmente marcan la diferencia. 
              Nuestro objetivo es ser tu socio estrategico en el camino hacia la innovacion.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={feature} 
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${200 + index * 50}ms` }}
                >
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image + Highlight Cards */}
          <div className="space-y-6">
            {/* Image */}
            <div className={`relative h-64 lg:h-80 rounded-2xl overflow-hidden transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}>
              <Image
                src="/about-office.jpg"
                alt="Oficina AIntegration"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
            
            {/* Highlight Cards */}
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className={`flex gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-500 hover-lift ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-primary/20">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
