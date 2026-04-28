"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarDays, Clock, CheckCircle, Loader2, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { es } from "date-fns/locale"

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
]

const FORMSPARK_FORM_ID = process.env.NEXT_PUBLIC_FORMSPARK_ID
const FORMSPARK_ACTION_URL = FORMSPARK_FORM_ID
  ? `https://submit-form.com/${FORMSPARK_FORM_ID}`
  : ""

const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2kzLpP5NpHU0eNXDl1NZWMlIJkPEp_4K2F93QbZ5sB-OYzl1nXw8L3J5qNvQ"

export function BookingSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
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
    
    if (!selectedDate || !selectedTime || !name || !phone) {
      alert("Por favor completa todos los campos")
      return
    }

    setIsSubmitting(true)

    const formattedDate = selectedDate.toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const data = {
      tipo: "Solicitud de reunion",
      nombre: name,
      telefono: phone,
      fecha: formattedDate,
      hora: selectedTime,
    }

    try {
      if (FORMSPARK_ACTION_URL) {
        await fetch(FORMSPARK_ACTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        })
      }

      setIsSubmitted(true)
      
      setTimeout(() => {
        window.open(GOOGLE_CALENDAR_URL, "_blank")
      }, 1500)

    } catch (error) {
      console.error("Error al enviar:", error)
      alert("Hubo un problema. Intentalo nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setSelectedDate(undefined)
    setSelectedTime("")
    setName("")
    setPhone("")
  }

  return (
    <section ref={sectionRef} id="agendar" className="py-24 lg:py-32 relative bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Agenda una reunion
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-balance">
              Conversemos sobre tu proyecto
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              Agenda una videollamada gratis de 30 minutos para conocer tu negocio y mostrarte como podemos ayudarte.
            </p>
          </div>

          {/* Booking Card */}
          <div className={`bg-card border border-border rounded-2xl p-6 sm:p-8 lg:p-10 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            {isSubmitted ? (
              <div className="text-center py-12 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Reunion agendada</h3>
                <p className="text-muted-foreground mb-6">
                  Te redirigiremos a Google Calendar para confirmar. Tambien te contactaremos por WhatsApp.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => window.open(GOOGLE_CALENDAR_URL, "_blank")}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Ir a Google Calendar
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Agendar otra reunion
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Calendar */}
                  <div className="space-y-4">
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
                  <div className="space-y-6">
                    {/* Time Select */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>Selecciona una hora</span>
                      </div>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger className="bg-background border-border focus:border-primary h-12">
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
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="space-y-2">
                        <Label htmlFor="booking-name" className="text-foreground font-medium">
                          Tu nombre <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="booking-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Como te llamas"
                          required
                          className="bg-background border-border focus:border-primary h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="booking-phone" className="text-foreground font-medium">
                          WhatsApp <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="booking-phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          type="tel"
                          placeholder="+56 9 1234 5678"
                          required
                          className="bg-background border-border focus:border-primary h-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || !selectedDate || !selectedTime}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Agendando...
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-5 w-5" />
                      Agendar videollamada gratis
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Recibiras un enlace de Google Meet para la reunion. Sin costo ni compromiso.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
