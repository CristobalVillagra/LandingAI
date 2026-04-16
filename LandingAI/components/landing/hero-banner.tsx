"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "+50", label: "Proyectos Exitosos" },
  { value: "+30", label: "Clientes Activos" },
  { value: "99%", label: "Satisfaccion" },
  { value: "24/7", label: "Soporte" },
]

export function HeroBanner() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-team.jpg"
          alt="Equipo AIntegration"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-down animate-on-load inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Soluciones Tecnologicas para tu Negocio</span>
          </div>

          {/* Main Heading */}
          <h1 className="animate-fade-up animate-on-load delay-100 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight text-balance">
            Transformamos tu negocio con{" "}
            <span className="text-primary">tecnologia inteligente</span>
          </h1>

          {/* Description */}
          <p className="animate-fade-up animate-on-load delay-200 text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
            Desde desarrollo web hasta integraciones avanzadas. 
            Cotiza tus servicios de informatica y lleva tu empresa al siguiente nivel.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up animate-on-load delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-14 text-base font-semibold group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              asChild
            >
              <Link href="#cotizar">
                Cotizar Servicios
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:border-primary hover:text-primary px-8 h-14 text-base font-semibold transition-all duration-300"
              asChild
            >
              <Link href="#servicios">
                Ver Servicios
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="animate-fade-up animate-on-load delay-400 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="text-center group"
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1 transition-transform duration-300 group-hover:scale-110">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animate-on-load delay-600">
          <Link
            href="#servicios"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
          >
            <span className="text-sm font-medium">Explorar</span>
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </Link>
        </div>
      </div>
    </section>
  )
}
