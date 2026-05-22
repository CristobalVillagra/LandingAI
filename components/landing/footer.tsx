"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import { Mail, Phone, MapPin, Linkedin, Instagram, Send, CheckCircle, Loader2, CalendarDays, Clock, X, ExternalLink } from "lucide-react"
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
import { format } from "date-fns"

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

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00",
]

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://n8n.aintegration.cl/webhook/formulario-web"

const CHILE_TIME_ZONE = "America/Santiago"

type ActiveForm = "quote" | "booking" | null

interface WebhookResponse {
  reply?: string
  output?: string
  meetLink?: string
  message?: string
  status?: string
}

function getTimeZoneOffsetMinutes(timeZone: string, date: Date) {
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
  const zonedDate = new Date(date.toLocaleString("en-US", { timeZone }))
  return (zonedDate.getTime() - utcDate.getTime()) / 60000
}

function toChileIsoString(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  const wallClockUtc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0))
  const offsetMinutes = getTimeZoneOffsetMinutes(CHILE_TIME_ZONE, wallClockUtc)
  const sign = offsetMinutes >= 0 ? "+" : "-"
  const absoluteOffset = Math.abs(offsetMinutes)
  const offsetHours = String(Math.floor(absoluteOffset / 60)).padStart(2, "0")
  const offsetMins = String(absoluteOffset % 60).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${date.getFullYear()}-${month}-${day}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00${sign}${offsetHours}:${offsetMins}`
}

// Skeleton loader component
function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-5/6" />
      <div className="h-4 bg-muted rounded w-4/6" />
    </div>
  )
}

// Response bubble component
function ResponseBubble({ response, meetLink }: { response: string; meetLink?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-primary/10 border border-primary/20 rounded-2xl p-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <CheckCircle className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-foreground leading-relaxed">{response}</p>
          {meetLink && (
            <a
              href={meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Unirse a Google Meet
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function Footer() {
  const [activeForm, setActiveForm] = useState<ActiveForm>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [sessionId] = useState(() => uuidv4())

  // Quote form state
  const [quoteName, setQuoteName] = useState("")
  const [quoteEmail, setQuoteEmail] = useState("")
  const [quoteDescription, setQuoteDescription] = useState("")
  const [quoteSubmitting, setQuoteSubmitting] = useState(false)
  const [quoteResponse, setQuoteResponse] = useState<string | null>(null)

  const [success, setSuccess] = useState(false)

  // Booking form state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [bookingName, setBookingName] = useState("")
  const [bookingEmail, setBookingEmail] = useState("")
  const [bookingSubmitting, setBookingSubmitting] = useState(false)
  const [bookingResponse, setBookingResponse] = useState<string | null>(null)
  const [meetLink, setMeetLink] = useState<string | null>(null)

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

  const handleFormToggle = (form: ActiveForm) => {
    if (activeForm === form) {
      setIsExpanded(false)
      setTimeout(() => setActiveForm(null), 300)
    } else {
      setActiveForm(form)
      setIsExpanded(true)
    }
  }

  const closeForm = () => {
    setIsExpanded(false)
    setTimeout(() => setActiveForm(null), 300)
  }

  const handleSubmit = async (type: "quote" | "booking") => {
  let message = ""
  let payload: Record<string, string> = {}

  // 1. Validaciones iniciales
  if (type === "quote") {
    if (!quoteName || !quoteEmail || !quoteDescription) {
      alert("Por favor completa todos los campos")
      return
    }
    setQuoteSubmitting(true)
    message = `Solicitud de diseño web gratis de ${quoteName}, email: ${quoteEmail}. Descripcion del proyecto: ${quoteDescription}`
    payload = {
      type,
      tipoFormulario: "cotizacion",
      sessionId,
      nombre: quoteName,
      email: quoteEmail,
      descripcion: quoteDescription,
      message,
      origen: "landing-aintegration",
    }
  } else {
    if (!bookingName || !bookingEmail || !selectedDate || !selectedTime) {
      alert("Por favor completa todos los campos")
      return
    }
    setBookingSubmitting(true)
    const formattedDate = format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })
    const fechaIso = toChileIsoString(selectedDate, selectedTime)
    message = `Quiero agendar reunion con ${bookingName}, email: ${bookingEmail} para el ${formattedDate} a las ${selectedTime} hrs`
    payload = {
      type,
      tipoFormulario: "agenda",
      sessionId,
      nombre: bookingName,
      email: bookingEmail,
      fecha_iso: fechaIso,
      fecha_local: formattedDate,
      hora: selectedTime,
      timezone: CHILE_TIME_ZONE,
      message,
      origen: "landing-aintegration",
    }
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    // 2. Manejo de la respuesta
    if (!response.ok) {
      throw new Error(`Error en el servidor: ${response.status}`);
    }

    // 3. n8n puede responder 200 con cuerpo vacio si una rama falla o no llega al Respond node.
    const responseText = await response.text()
    let data: WebhookResponse = {};

    if (responseText.trim()) {
      try {
        data = JSON.parse(responseText) as WebhookResponse
      } catch (parseError) {
        console.warn("Respuesta no JSON desde n8n:", responseText, parseError)
      }
    }

    // 4. Lógica de éxito según el tipo
    setSuccess(true); 

    if (type === "quote") {
      setQuoteResponse(data.reply || data.output || data.message || "Hemos recibido tu solicitud. Te contactaremos pronto.")
      setQuoteName("")
      setQuoteEmail("")
      setQuoteDescription("")
    } else {
      setBookingResponse(data.reply || data.output || data.message || "Tu reunión ha sido agendada exitosamente.")
      if (data.meetLink) {
        setMeetLink(data.meetLink)
      }
      setBookingName("")
      setBookingEmail("")
      setSelectedDate(undefined)
      setSelectedTime("")
    }

  } catch (error) {
    console.error("Error detallado:", error)
    if (type === "quote") {
      setQuoteResponse("Hubo un problema al procesar tu solicitud. Por favor intenta nuevamente.")
    } else {
      setBookingResponse("Hubo un problema al agendar tu reunión. Por favor intenta nuevamente.")
    }
  } finally {
    if (type === "quote") {
      setQuoteSubmitting(false)
    } else {
      setBookingSubmitting(false)
    }
  }
}

const resetQuoteForm = () => {
  setQuoteResponse(null)
  setQuoteName("")
  setQuoteEmail("")
  setQuoteDescription("")
}

const resetBookingForm = () => {
  setBookingResponse(null)
  setMeetLink(null)
  setBookingName("")
  setBookingEmail("")
  setSelectedDate(undefined)
  setSelectedTime("")
}

return (
  <footer ref={sectionRef} id="contacto" className="bg-card border-t border-border relative">
    {/* Expandable Form Section */}
    <AnimatePresence>
      {isExpanded && activeForm && (
        <motion.div
          id="cotizar"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden border-b border-border"
        >
          <div className="py-12 lg:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-2xl mx-auto">
                {/* Close button */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={closeForm}
                    className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Cerrar formulario"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Form Content with Transition */}
                <AnimatePresence mode="wait">
                  {activeForm === "quote" && (
                    <motion.div
                      key="quote"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
                          Te enviamos gratis un diseno web
                        </h2>
                        <p className="text-muted-foreground">
                          Cuentanos sobre tu proyecto y te enviaremos una propuesta personalizada.
                        </p>
                      </div>

                      <div className="bg-background border border-border rounded-2xl p-6 sm:p-8">
                        {quoteSubmitting ? (
                          <FormSkeleton />
                        ) : quoteResponse ? (
                          <div className="space-y-4">
                            <ResponseBubble response={quoteResponse} />
                            <Button
                              variant="outline"
                              onClick={resetQuoteForm}
                              className="w-full"
                            >
                              Enviar otra solicitud
                            </Button>
                          </div>
                        ) : (
                          <form onSubmit={(e) => { e.preventDefault(); handleSubmit("quote"); }} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                              <div className="space-y-2">
                                <Label htmlFor="quote-name" className="text-foreground font-medium">
                                  Nombre <span className="text-primary">*</span>
                                </Label>
                                <Input
                                  id="quote-name"
                                  value={quoteName}
                                  onChange={(e) => setQuoteName(e.target.value)}
                                  placeholder="Tu nombre"
                                  required
                                  className="bg-card border-border h-11"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="quote-email" className="text-foreground font-medium">
                                  Email <span className="text-primary">*</span>
                                </Label>
                                <Input
                                  id="quote-email"
                                  type="email"
                                  value={quoteEmail}
                                  onChange={(e) => setQuoteEmail(e.target.value)}
                                  placeholder="tu@email.com"
                                  required
                                  className="bg-card border-border h-11"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="quote-description" className="text-foreground font-medium">
                                Descripcion del proyecto <span className="text-primary">*</span>
                              </Label>
                              <Textarea
                                id="quote-description"
                                value={quoteDescription}
                                onChange={(e) => setQuoteDescription(e.target.value)}
                                placeholder="Cuentanos brevemente sobre tu negocio y que tipo de web necesitas..."
                                rows={4}
                                required
                                className="bg-card border-border resize-none"
                              />
                            </div>

                            <Button
                              type="submit"
                              size="lg"
                              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                            >
                              <Send className="mr-2 h-5 w-5" />
                              Enviar solicitud
                            </Button>
                          </form>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeForm === "booking" && (
                    <motion.div
                      key="booking"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
                          Agenda una reunion
                        </h2>
                        <p className="text-muted-foreground">
                          Conversemos sobre tu proyecto en una videollamada gratuita de 30 minutos.
                        </p>
                      </div>

                      <div className="bg-background border border-border rounded-2xl p-6 sm:p-8">
                        {bookingSubmitting ? (
                          <FormSkeleton />
                        ) : bookingResponse ? (
                          <div className="space-y-4">
                            <ResponseBubble response={bookingResponse} meetLink={meetLink || undefined} />
                            <Button
                              variant="outline"
                              onClick={resetBookingForm}
                              className="w-full"
                            >
                              Agendar otra reunion
                            </Button>
                          </div>
                        ) : (
                          <form onSubmit={(e) => { e.preventDefault(); handleSubmit("booking"); }} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-5">
                              <div className="space-y-2">
                                <Label htmlFor="booking-name" className="text-foreground font-medium">
                                  Nombre <span className="text-primary">*</span>
                                </Label>
                                <Input
                                  id="booking-name"
                                  value={bookingName}
                                  onChange={(e) => setBookingName(e.target.value)}
                                  placeholder="Tu nombre"
                                  required
                                  className="bg-card border-border h-11"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="booking-email" className="text-foreground font-medium">
                                  Email <span className="text-primary">*</span>
                                </Label>
                                <Input
                                  id="booking-email"
                                  type="email"
                                  value={bookingEmail}
                                  onChange={(e) => setBookingEmail(e.target.value)}
                                  placeholder="tu@email.com"
                                  required
                                  className="bg-card border-border h-11"
                                />
                              </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                              {/* Calendar */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                  <CalendarDays className="h-5 w-5 text-primary" />
                                  <span>Selecciona una fecha</span>
                                </div>
                                <div className="flex justify-center">
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
                                    className="rounded-xl border border-border bg-card p-3"
                                  />
                                </div>
                              </div>

                              {/* Time Selection */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                  <Clock className="h-5 w-5 text-primary" />
                                  <span>Selecciona una hora</span>
                                </div>
                                <Select value={selectedTime} onValueChange={setSelectedTime}>
                                  <SelectTrigger className="bg-card border-border h-11">
                                    <SelectValue placeholder="Elige un horario" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeSlots.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time} hrs
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                {selectedDate && selectedTime && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-primary/10 rounded-lg border border-primary/20"
                                  >
                                    <p className="text-sm text-foreground">
                                      <span className="font-medium">Fecha seleccionada:</span>
                                      <br />
                                      {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })} a las {selectedTime} hrs
                                    </p>
                                  </motion.div>
                                )}
                              </div>
                            </div>

                            <Button
                              type="submit"
                              size="lg"
                              disabled={!selectedDate || !selectedTime}
                              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 disabled:opacity-50"
                            >
                              <CalendarDays className="mr-2 h-5 w-5" />
                              Agendar videollamada
                            </Button>
                          </form>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Fixed Action Buttons */}
    <div className="sticky bottom-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="py-4 flex gap-4">
          <Button
            onClick={() => handleFormToggle("quote")}
            size="lg"
            className={`flex-1 h-12 font-semibold transition-all duration-300 ${activeForm === "quote"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
          >
            Diseno Web Gratis
          </Button>
          <Button
            onClick={() => handleFormToggle("booking")}
            size="lg"
            className={`flex-1 h-12 font-semibold transition-all duration-300 ${activeForm === "booking"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
          >
            Agendar Reunion
          </Button>
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
                Ejecutivo de ventas: +56 9 3902 2969
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
