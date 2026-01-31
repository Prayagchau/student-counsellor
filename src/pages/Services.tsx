import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { services } from "@/data/services";
import { ArrowRight, CheckCircle } from "lucide-react";

const processSteps = [
  {
    step: "01",
    title: "Book a Session",
    description: "Choose your preferred counsellor and book a convenient time slot.",
  },
  {
    step: "02",
    title: "Initial Assessment",
    description: "Complete a comprehensive aptitude and interest assessment.",
  },
  {
    step: "03",
    title: "Expert Consultation",
    description: "Have a 1-on-1 session with your counsellor to discuss your goals.",
  },
  {
    step: "04",
    title: "Personalized Roadmap",
    description: "Receive a detailed action plan tailored to your career goals.",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground md:text-5xl">
              Our Services
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Comprehensive education solutions to guide you at every step of your academic 
              and professional journey.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-pattern">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard key={i} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
              How It Works
            </span>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Your Journey to Success
            </h2>
            <p className="text-lg text-muted-foreground">
              A simple 4-step process to get you started on your path to success.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-card rounded-2xl p-6 shadow-custom-md border border-border/50 h-full">
                  <div className="mb-4 text-4xl font-bold text-primary/20">{item.step}</div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                    <ArrowRight className="h-6 w-6 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
                Why Choose Us
              </span>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Trusted by Thousands of Students
              </h2>
              <p className="mb-8 text-muted-foreground leading-relaxed">
                Our commitment to quality and student success sets us apart. Here's what makes 
                EduGuide your ideal education partner.
              </p>

              <div className="space-y-4">
                {[
                  "50+ verified expert counsellors",
                  "Personalized 1-on-1 guidance",
                  "95% student satisfaction rate",
                  "Affordable and transparent pricing",
                  "Pan-India and international coverage",
                  "Post-session support and follow-ups",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/book" className="inline-block mt-8">
                <Button variant="hero" size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=500&fit=crop"
                alt="Counselling session"
                className="rounded-2xl shadow-custom-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding hero-gradient">
        <div className="container-custom text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Take the Next Step?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80">
            Book a free counselling session and let our experts guide you towards your dream career.
          </p>
          <Link to="/book">
            <Button 
              size="xl" 
              className="gap-2 bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
            >
              Book Free Session
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
