import { Header } from "@/components/landing/header"
import { HeroBanner } from "@/components/landing/hero-banner"
import { TechCarousel } from "@/components/landing/tech-carousel"
import { ServicesSection } from "@/components/landing/services-section"
import { AboutSection } from "@/components/landing/about-section"
import { InstagramFeed } from "@/components/landing/instagram-feed"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <TechCarousel />
        <ServicesSection />
        <AboutSection />
        <InstagramFeed />
      </main>
      <Footer />
    </div>
  )
}
