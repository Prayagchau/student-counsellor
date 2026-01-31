import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  link: string;
}

export function ServiceCard({ icon: Icon, title, description, features, link }: ServiceCardProps) {
  return (
    <div className="group bg-card rounded-2xl p-6 card-hover shadow-custom-md border border-border/50 flex flex-col h-full">
      {/* Icon */}
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-7 w-7" />
      </div>

      {/* Content */}
      <h3 className="mb-3 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Features */}
      <ul className="mb-6 space-y-2 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link to={link}>
        <Button variant="ghost" className="group/btn gap-2 p-0 h-auto text-primary hover:bg-transparent">
          Learn More
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </Link>
    </div>
  );
}
