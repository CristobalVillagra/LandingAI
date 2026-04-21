"use client"

import { useState, useRef, useEffect } from "react"
import { Send, CheckCircle, Loader2, AlignCenter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const services = [
  "Pagina Web",
  "Automatizacion con IA",
  "Sistema de Reservas / Pagos / Ventas",
  "Otro",
]

const FORMSPARK_FORM_ID = process.env.NEXT_PUBLIC_FORMSPARK_ID
const FORMSPARK_ACTION_URL = FORMSPARK_FORM_ID
  ? `https://submit-form.com/${FORMSPARK_FORM_ID}`
  : ""

export function QuoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget

    if (!FORMSPARK_ACTION_URL) {
      console.error("Falta NEXT_PUBLIC_FORMSPARK_ID en el entorno.")
      alert("No se pudo enviar el formulario porque falta la configuracion del servicio.")
      setIsSubmitting(false)
      return
    }

    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    try {
      const response = await fetch(FORMSPARK_ACTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Formspark respondio con ${response.status}`)
      }

      form.reset()
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      alert("Hubo un problema al enviar la solicitud. Intentalo nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} id="cotizar" className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Diseño web gratis
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-balance">
              Te enviamos gratis y sin compromiso, un diseño web de tu negocio
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              No necesitas saber nada tecnico. Usamos la informacion y contenido que tengas en la cuenta de instagram de tu negocio y te mostramos como quedaria tu web.
            </p>
          </div>

          {/* Form Card */}
          <div className={`bg-card border border-border rounded-2xl p-6 sm:p-8 lg:p-10 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            {isSubmitted ? (
              <div className="text-center py-12 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Listo 👌</h3>
                <p className="text-muted-foreground">
                  Te enviaremos una propuesta por WhatsApp lo antes posible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-medium">
                      Nombre <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Tu nombre"
                      required
                      className="bg-background border-border focus:border-primary h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground font-medium">
                      WhatsApp <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      required
                      className="bg-background border-border focus:border-primary h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-center max-w-md mx-auto w-full">
                  <Label htmlFor="service" className="text-foreground font-medium block">
                    ¿Que necesitas? <span className="text-primary">*</span>
                  </Label>
                  <Select name="service" required>
                    <SelectTrigger className="bg-background border-border focus:border-primary h-12 w-full">
                      <SelectValue placeholder="Selecciona una opcion" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground font-medium">
                    Tu negocio (Instagram o nombre) <span className="text-primary">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Ej: @mipeluqueria o nombre del negocio"
                    rows={3}
                    required
                    className="bg-background border-border focus:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Quiero mi web
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Te respondemos por WhatsApp. No necesitas saber nada tecnico.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
