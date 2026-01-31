import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { counsellors } from "@/data/counsellors";
import { 
  Star, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Users, 
  MessageCircle,
  ArrowLeft,
  Award,
  Globe
} from "lucide-react";

export default function CounsellorProfile() {
  const { id } = useParams();
  const counsellor = counsellors.find((c) => c.id === id);

  if (!counsellor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom section-padding text-center">
          <h1 className="text-2xl font-bold text-foreground">Counsellor not found</h1>
          <Link to="/counsellors">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Counsellors
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const expertise = [
    "Career Assessment & Planning",
    "College Selection & Admissions",
    "Entrance Exam Strategy",
    "Scholarship Guidance",
    "Interview Preparation",
  ];

  const education = [
    { degree: "Ph.D. in Educational Psychology", institution: "Delhi University" },
    { degree: "M.Ed. in Counselling", institution: "IGNOU" },
    { degree: "Certified Career Counsellor", institution: "NCDA, USA" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-padding">
        <div className="container-custom">
          {/* Back Button */}
          <Link to="/counsellors">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Counsellors
            </Button>
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Header */}
              <div className="bg-card rounded-2xl p-6 shadow-custom-md border border-border/50">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <img
                    src={counsellor.image}
                    alt={counsellor.name}
                    className="h-32 w-32 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold text-foreground">{counsellor.name}</h1>
                      {counsellor.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-primary font-medium mb-4">{counsellor.specialization}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-semibold text-foreground">{counsellor.rating}</span>
                        <span>({counsellor.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {counsellor.experience}+ years experience
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {counsellor.languages.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="bg-card rounded-2xl p-6 shadow-custom-md border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  With over {counsellor.experience} years of experience in {counsellor.specialization.toLowerCase()}, 
                  {counsellor.name} has helped thousands of students achieve their academic and career goals. 
                  Known for personalized guidance and deep industry insights, they bring a unique combination 
                  of academic knowledge and practical experience to every counselling session.
                </p>
              </div>

              {/* Expertise */}
              <div className="bg-card rounded-2xl p-6 shadow-custom-md border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">Areas of Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {expertise.map((item, i) => (
                    <Badge key={i} variant="secondary" className="text-sm py-1.5 px-3">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-card rounded-2xl p-6 shadow-custom-md border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">Education & Certifications</h2>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">{edu.degree}</div>
                        <div className="text-sm text-muted-foreground">{edu.institution}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="bg-card rounded-2xl p-6 shadow-custom-md border border-border/50 sticky top-24">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-foreground">₹999</div>
                  <div className="text-muted-foreground">per session (45 mins)</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Flexible Scheduling</div>
                      <div className="text-sm text-muted-foreground">Book slots that suit you</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">45-Minute Sessions</div>
                      <div className="text-sm text-muted-foreground">Focused 1-on-1 guidance</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Video Consultation</div>
                      <div className="text-sm text-muted-foreground">Secure online sessions</div>
                    </div>
                  </div>
                </div>

                <Link to={`/book?counsellor=${counsellor.id}`}>
                  <Button variant="hero" size="lg" className="w-full">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Session
                  </Button>
                </Link>

                <div className="mt-4 text-center">
                  <span className={`text-sm font-medium ${counsellor.available ? "text-success" : "text-muted-foreground"}`}>
                    {counsellor.available ? "✓ Available for booking" : "Currently unavailable"}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-card rounded-2xl p-6 shadow-custom-md border border-border/50">
                <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-xl">
                    <div className="text-2xl font-bold text-foreground">{counsellor.reviews}+</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-xl">
                    <div className="text-2xl font-bold text-foreground">{counsellor.rating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-xl">
                    <div className="text-2xl font-bold text-foreground">{counsellor.experience}+</div>
                    <div className="text-xs text-muted-foreground">Years Exp.</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-xl">
                    <div className="text-2xl font-bold text-foreground">98%</div>
                    <div className="text-xs text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
