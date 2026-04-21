import { Header } from "@/components/landing/header"
import { HeroBanner } from "@/components/landing/hero-banner"
import { ServicesSection } from "@/components/landing/services-section"
import { AboutSection } from "@/components/landing/about-section"
import { InstagramFeed } from "@/components/landing/instagram-feed"
import { QuoteForm } from "@/components/landing/quote-form"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <ServicesSection />
        <AboutSection />
        <InstagramFeed />
        <QuoteForm />
      </main>
      <Footer />
    </div>
  )
}
