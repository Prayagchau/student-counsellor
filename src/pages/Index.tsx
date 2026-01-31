import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CounsellorCard } from "@/components/cards/CounsellorCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { counsellors } from "@/data/counsellors";
import { services } from "@/data/services";
import heroImage from "@/assets/hero-education.jpg";
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Award, 
  TrendingUp, 
  MessageCircle,
  Star
} from "lucide-react";

const stats = [
  { value: "10,000+", label: "Students Guided", icon: Users },
  { value: "50+", label: "Expert Counsellors", icon: Award },
  { value: "95%", label: "Placement Rate", icon: TrendingUp },
  { value: "4.8/5", label: "Average Rating", icon: Star },
];

const testimonials = [
  {
    name: "Amit Verma",
    role: "B.Tech Student, IIT Delhi",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "EduGuide helped me navigate the JEE preparation and counselling process. Their guidance was invaluable in securing my seat at IIT Delhi.",
    rating: 5,
  },
  {
    name: "Priyanka Joshi",
    role: "MS in USA",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    content: "From TOEFL preparation to visa interview, EduGuide was with me every step. Now I'm studying at my dream university in California!",
    rating: 5,
  },
  {
    name: "Rahul Sharma",
    role: "Placed at Google",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    content: "The placement support team at EduGuide transformed my interview skills. Their mock sessions and resume tips landed me my dream job.",
    rating: 5,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Education counselling"
            className="h-full w-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        {/* Content */}
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-primary-foreground">
              <CheckCircle className="h-4 w-4" />
              Trusted by 10,000+ Students & Parents
            </div>
            
            <h1 className="mb-6 text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Shape Your Future with{" "}
              <span className="text-gradient">Expert Guidance</span>
            </h1>
            
            <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl max-w-2xl">
              Connect with verified career counsellors for personalized admission guidance, 
              placement support, and career planning. Your success journey starts here.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/book">
                <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                  Book Free Counselling
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/counsellors">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  Explore Counsellors
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container-custom">
            <div className="grid grid-cols-2 gap-4 pb-8 md:grid-cols-4 lg:-mb-16">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="stat-card glass"
                >
                  <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <div className="text-2xl font-bold text-foreground md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-pattern" id="services">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
              Our Services
            </span>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Comprehensive Education Solutions
            </h2>
            <p className="text-lg text-muted-foreground">
              From career discovery to job placement, we provide end-to-end support 
              for your educational journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard key={i} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Counsellors */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
                Expert Team
              </span>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Meet Our Counsellors
              </h2>
            </div>
            <Link to="/counsellors">
              <Button variant="outline" className="gap-2">
                View All Counsellors
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {counsellors.slice(0, 3).map((counsellor) => (
              <CounsellorCard key={counsellor.id} counsellor={counsellor} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
              Success Stories
            </span>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              What Our Students Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Real stories from students who transformed their careers with our guidance.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-6 shadow-custom-md border border-border/50"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding hero-gradient">
        <div className="container-custom text-center">
          <div className="mx-auto max-w-2xl">
            <MessageCircle className="mx-auto mb-6 h-12 w-12 text-primary-foreground/80" />
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              Book a free counselling session today and take the first step 
              towards your dream career.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/book">
                <Button 
                  size="xl" 
                  className="gap-2 bg-primary-foreground text-foreground hover:bg-primary-foreground/90 w-full sm:w-auto"
                >
                  Book Free Session
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
