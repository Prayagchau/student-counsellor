import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  Target, 
  Heart, 
  Users, 
  Award, 
  TrendingUp,
  ArrowRight
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Student-First Approach",
    description: "Every decision we make puts the student's career goals and aspirations at the center.",
  },
  {
    icon: Heart,
    title: "Integrity & Transparency",
    description: "We provide honest guidance without any hidden agendas or commission-based recommendations.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Our counsellors are verified professionals with proven track records in education and industry.",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Rigorous vetting process ensures only the best counsellors join our platform.",
  },
];

const milestones = [
  { year: "2018", title: "Founded", description: "Started with a vision to democratize career guidance" },
  { year: "2019", title: "1000 Students", description: "Reached our first thousand student milestone" },
  { year: "2021", title: "Pan-India Expansion", description: "Extended services to all major cities in India" },
  { year: "2023", title: "International Partnerships", description: "Partnered with 100+ universities worldwide" },
  { year: "2024", title: "10,000+ Success Stories", description: "Helped over 10,000 students achieve their dreams" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="hero-gradient py-20 md:py-28">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
              Empowering Futures Through Expert Guidance
            </h1>
            <p className="text-lg text-primary-foreground/80 md:text-xl">
              We're on a mission to make quality career counselling accessible to every 
              student, helping them make informed decisions about their education and careers.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
                Our Mission
              </span>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Bridging the Gap Between Education & Career Success
              </h2>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                EduGuide was founded with a simple yet powerful vision: to ensure that every 
                student in India has access to quality career guidance, regardless of their 
                background or location.
              </p>
              <p className="mb-8 text-muted-foreground leading-relaxed">
                We bring together a network of verified career counsellors, industry experts, 
                and educational professionals to provide personalized guidance that helps 
                students and professionals make informed decisions about their futures.
              </p>
              <div className="space-y-4">
                {[
                  "Personalized 1-on-1 counselling sessions",
                  "Verified and experienced counsellors",
                  "Data-driven career recommendations",
                  "End-to-end admission support",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Students discussing"
                className="rounded-2xl shadow-custom-xl"
              />
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-primary p-6 text-primary-foreground shadow-custom-lg">
                <div className="text-4xl font-bold">5+</div>
                <div className="text-sm opacity-80">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
              Our Values
            </span>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              What We Stand For
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 text-center shadow-custom-md border border-border/50">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "10,000+", label: "Students Guided", icon: Users },
              { value: "50+", label: "Expert Counsellors", icon: Award },
              { value: "95%", label: "Placement Success", icon: TrendingUp },
              { value: "100+", label: "Partner Universities", icon: Target },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                <div className="text-3xl font-bold text-foreground md:text-4xl">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-pattern">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
              Our Journey
            </span>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Milestones & Achievements
            </h2>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="relative border-l-2 border-primary/30 pl-8">
              {milestones.map((milestone, i) => (
                <div key={i} className="relative mb-8 last:mb-0">
                  <div className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div className="bg-card rounded-xl p-5 shadow-custom-md border border-border/50">
                    <div className="mb-2 text-sm font-semibold text-primary">{milestone.year}</div>
                    <h3 className="mb-1 font-semibold text-foreground">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding hero-gradient">
        <div className="container-custom text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Shape Your Future?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80">
            Join thousands of students who have transformed their careers with our expert guidance.
          </p>
          <Link to="/book">
            <Button 
              size="xl" 
              className="gap-2 bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
            >
              Get Started Today
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
