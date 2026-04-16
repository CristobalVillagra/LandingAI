"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Datos para los selects
const services = ["Desarrollo Web", "Automatización", "SaaS", "Consultoría"];
const budgets = ["Menos de $500", "$500 - $1000", "$1000 - $5000", "Más de $5000"];

const FORMSPARK_ACTION_URL = `https://submit-form.com/${process.env.NEXT_PUBLIC_FORMSPARK_ID}`;

export default function ContactForm() {
  
  // Estados
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Efecto para la animación de entrada
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Enviando a:", FORMSPARK_ACTION_URL);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(FORMSPARK_ACTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div
        className={`bg-card border border-border rounded-2xl p-6 sm:p-8 lg:p-10 transition-all duration-700 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {isSubmitted ? (
          <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Solicitud Enviada</h3>
            <p className="text-muted-foreground">
              Gracias por contactarnos. Te responderemos pronto.
            </p>
            <Button 
              variant="outline" 
              className="mt-6" 
              onClick={() => setIsSubmitted(false)}
            >
              Enviar otro mensaje
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Nombre completo <span className="text-primary">*</span>
                </Label>
                <Input
                  id="name"
                  name="name" // IMPORTANTE para Formspark
                  placeholder="Tu nombre"
                  required
                  className="bg-background border-border focus:border-primary h-12 transition-colors duration-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Correo electrónico <span className="text-primary">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  className="bg-background border-border focus:border-primary h-12 transition-colors duration-300"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  className="bg-background border-border focus:border-primary h-12 transition-colors duration-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground font-medium">Empresa</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Nombre de tu empresa"
                  className="bg-background border-border focus:border-primary h-12 transition-colors duration-300"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="service" className="text-foreground font-medium">
                  Servicio de interés <span className="text-primary">*</span>
                </Label>
                {/* Select requiere name para FormData */}
                <Select name="service" required>
                  <SelectTrigger className="bg-background border-border focus:border-primary h-12">
                    <SelectValue placeholder="Selecciona un servicio" />
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
                <Label htmlFor="budget" className="text-foreground font-medium">Presupuesto estimado</Label>
                <Select name="budget">
                  <SelectTrigger className="bg-background border-border focus:border-primary h-12">
                    <SelectValue placeholder="Selecciona un rango" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgets.map((budget) => (
                      <SelectItem key={budget} value={budget}>
                        {budget}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground font-medium">
                Describe tu proyecto <span className="text-primary">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Cuéntanos los detalles..."
                rows={5}
                required
                className="bg-background border-border focus:border-primary resize-none transition-colors duration-300"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base font-semibold transition-all duration-300 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Enviar Solicitud
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Al enviar aceptas nuestra política de privacidad.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}