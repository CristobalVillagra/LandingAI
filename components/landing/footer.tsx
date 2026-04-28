"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin, Linkedin, Instagram, Send, CheckCircle, Loader2, CalendarDays, Clock, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { es } from "date-fns/locale"

const footerLinks = {
  servicios: [
    { label: "Pagina Web", href: "#servicios" },
    { label: "Automatizacion con IA", href: "#servicios" },
    { label: "Sistemas (Reservas, pagos, ventas)", href: "#servicios" },
  ],
  empresa: [
    { label: "Nosotros", href: "#nosotros" },
    { label: "Instagram", href: "#instagram" },
    { label: "Contacto", href: "#contacto" },
  ],
  legal: [
    { label: "Terminos", href: "#" },
    { label: "Privacidad", href: "#" },
  ],
}

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/aintegration.cl/", label: "Instagram" },
]

const quoteServices = [
  "Pagina Web",
  "Automatizacion con IA",
  "Sistema de Reservas / Pagos / Ventas",
  "Otro",
]

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00",
]

const FORMSPARK_FORM_ID = process.env.NEXT_PUBLIC_FORMSPARK_ID
const FORMSPARK_ACTION_URL = FORMSPARK_FORM_ID
  ? `https://submit-form.com/${FORMSPARK_FORM_ID}`
  : ""

const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2kzLpP5NpHU0eNXDl1NZWMlIJkPEp_4K2F93QbZ5sB-OYzl1nXw8L3J5qNvQ"

type ActiveForm = "quote" | "booking"

export function Footer() {
  const [activeForm, setActiveForm] = useState<ActiveForm>("quote")
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Quote form state
  const [quoteSubmitting, setQuoteSubmitting] = useState(false)
  const [quoteSubmitted, setQuoteSubmitted] = useState(false)

  // Booking form state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [bookingName, setBookingName] = useState("")
  const [bookingPhone, setBookingPhone] = useState("")
  const [bookingSubmitting, setBookingSubmitting] = useState(false)
  const [bookingSubmitted, setBookingSubmitted] = useState(false)

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

  const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setQuoteSubmitting(true)

    const form = e.currentTarget
    if (!FORMSPARK_ACTION_URL) {
      alert("No se pudo enviar el formulario.")
      setQuoteSubmitting(false)
      return
    }

    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    try {
      const response = await fetch(FORMSPARK_ACTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Error")

      form.reset()
      setQuoteSubmitted(true)
      setTimeout(() => setQuoteSubmitted(false), 5000)
    } catch {
      alert("Hubo un problema. Intentalo nuevamente.")
    } finally {
      setQuoteSubmitting(false)
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!selectedDate || !selectedTime || !bookingName || !bookingPhone) {
      alert("Por favor completa todos los campos")
      return
    }

    setBookingSubmitting(true)

    const formattedDate = selectedDate.toLocaleDateString("es-CL", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    })

    const data = {
      tipo: "Solicitud de reunion",
      nombre: bookingName,
      telefono: bookingPhone,
      fecha: formattedDate,
      hora: selectedTime,
    }

    try {
      if (FORMSPARK_ACTION_URL) {
        await fetch(FORMSPARK_ACTION_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        })
      }

      setBookingSubmitted(true)
      setTimeout(() => window.open(GOOGLE_CALENDAR_URL, "_blank"), 1500)
    } catch {
      alert("Hubo un problema. Intentalo nuevamente.")
    } finally {
      setBookingSubmitting(false)
    }
  }

  const resetBooking = () => {
    setBookingSubmitted(false)
    setSelectedDate(undefined)
    setSelectedTime("")
    setBookingName("")
    setBookingPhone("")
  }

  return (
    <footer ref={sectionRef} id="contacto" className="bg-card border-t border-border">
      {/* Forms Section */}
      <div id="cotizar" className="py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Tab Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-10 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <button
                onClick={() => setActiveForm("quote")}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeForm === "quote"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Diseño web gratis
              </button>
              <button
                onClick={() => setActiveForm("booking")}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeForm === "booking"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Agendar reunion
              </button>
            </div>

            {/* Forms Container with Animation */}
            <div className={`relative transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              {/* Quote Form */}
              <div className={`transition-all duration-500 ${
                activeForm === "quote" 
                  ? "opacity-100 translate-x-0" 
                  : "opacity-0 translate-x-[-20px] absolute inset-0 pointer-events-none"
              }`}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
                    Te enviamos gratis un diseño web de tu negocio
                  </h2>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Usamos la informacion de tu Instagram y te mostramos como quedaria tu web.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                  {quoteSubmitted ? (
                    <div className="text-center py-8 animate-scale-in">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">Listo</h3>
                      <p className="text-muted-foreground">Te enviaremos una propuesta por WhatsApp.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleQuoteSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-foreground font-medium">
                            Nombre <span className="text-primary">*</span>
                          </Label>
                          <Input id="name" name="name" placeholder="Tu nombre" required className="bg-background border-border h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-foreground font-medium">
                            WhatsApp <span className="text-primary">*</span>
                          </Label>
                          <Input id="phone" name="phone" type="tel" placeholder="+56 9 1234 5678" required className="bg-background border-border h-11" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="service" className="text-foreground font-medium">
                          ¿Que necesitas? <span className="text-primary">*</span>
                        </Label>
                        <Select name="service" required>
                          <SelectTrigger className="bg-background border-border h-11">
                            <SelectValue placeholder="Selecciona una opcion" />
                          </SelectTrigger>
                          <SelectContent>
                            {quoteServices.map((service) => (
                              <SelectItem key={service} value={service}>{service}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-foreground font-medium">
                          Tu negocio (Instagram o nombre) <span className="text-primary">*</span>
                        </Label>
                        <Textarea id="message" name="message" placeholder="Ej: @mipeluqueria" rows={2} required className="bg-background border-border resize-none" />
                      </div>

                      <Button type="submit" size="lg" disabled={quoteSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12">
                        {quoteSubmitting ? (
                          <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Enviando...</>
                        ) : (
                          <><Send className="mr-2 h-5 w-5" />Quiero mi web</>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>

              {/* Booking Form */}
              <div className={`transition-all duration-500 ${
                activeForm === "booking" 
                  ? "opacity-100 translate-x-0" 
                  : "opacity-0 translate-x-[20px] absolute inset-0 pointer-events-none"
              }`}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
                    Conversemos sobre tu proyecto
                  </h2>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Agenda una videollamada gratis de 30 minutos para conocer tu negocio.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                  {bookingSubmitted ? (
                    <div className="text-center py-8 animate-scale-in">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">Reunion agendada</h3>
                      <p className="text-muted-foreground mb-4">Te redirigiremos a Google Calendar.</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={() => window.open(GOOGLE_CALENDAR_URL, "_blank")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                          <Video className="mr-2 h-4 w-4" />Ir a Google Calendar
                        </Button>
                        <Button variant="outline" onClick={resetBooking}>Agendar otra</Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Calendar */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-foreground font-medium">
                            <CalendarDays className="h-5 w-5 text-primary" />
                            <span>Selecciona una fecha</span>
                          </div>
                          <div className="flex justify-center lg:justify-start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              locale={es}
                              disabled={(date) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                const day = date.getDay()
                                return date < today || day === 0 || day === 6
                              }}
                              className="rounded-xl border border-border bg-background p-3"
                            />
                          </div>
                        </div>

                        {/* Time + Contact */}
                        <div className="space-y-5">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-foreground font-medium">
                              <Clock className="h-5 w-5 text-primary" />
                              <span>Selecciona una hora</span>
                            </div>
                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                              <SelectTrigger className="bg-background border-border h-11">
                                <SelectValue placeholder="Elige un horario" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>{time} hrs</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-border">
                            <div className="space-y-2">
                              <Label htmlFor="booking-name" className="text-foreground font-medium">
                                Tu nombre <span className="text-primary">*</span>
                              </Label>
                              <Input id="booking-name" value={bookingName} onChange={(e) => setBookingName(e.target.value)} placeholder="Como te llamas" required className="bg-background border-border h-11" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="booking-phone" className="text-foreground font-medium">
                                WhatsApp <span className="text-primary">*</span>
                              </Label>
                              <Input id="booking-phone" value={bookingPhone} onChange={(e) => setBookingPhone(e.target.value)} type="tel" placeholder="+56 9 1234 5678" required className="bg-background border-border h-11" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button type="submit" size="lg" disabled={bookingSubmitting || !selectedDate || !selectedTime} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12">
                        {bookingSubmitting ? (
                          <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Agendando...</>
                        ) : (
                          <><Video className="mr-2 h-5 w-5" />Agendar videollamada gratis</>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="py-12 lg:py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="#inicio" className="inline-block mb-4">
              <div className="relative h-10 w-40">
                <Image src="/banner-logo.png" alt="AIntegration" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed max-w-xs">
              Creamos tu pagina web y hacemos que te lleguen clientes sin que tengas que hacer nada.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Servicios</h4>
            <ul className="space-y-3">
              {footerLinks.servicios.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:aintegrationchile@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  aintegrationchile@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+56939022969" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  +56 9 3902 2969
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                Santiago, Chile
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} AIntegration. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
