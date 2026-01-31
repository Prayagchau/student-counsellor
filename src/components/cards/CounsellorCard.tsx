import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, Calendar } from "lucide-react";

export interface Counsellor {
  id: string;
  name: string;
  image: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  languages: string[];
  verified: boolean;
  available: boolean;
}

interface CounsellorCardProps {
  counsellor: Counsellor;
}

export function CounsellorCard({ counsellor }: CounsellorCardProps) {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden card-hover shadow-custom-md border border-border/50">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={counsellor.image}
          alt={counsellor.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {counsellor.verified && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-success/90 px-2 py-1 text-xs font-medium text-success-foreground">
            <CheckCircle className="h-3 w-3" />
            Verified
          </div>
        )}
        {counsellor.available && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-xs font-medium text-primary-foreground animate-pulse-soft">
            Available Now
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {counsellor.name}
          </h3>
          <p className="text-sm text-primary font-medium">
            {counsellor.specialization}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="text-sm font-semibold text-foreground">
              {counsellor.rating}
            </span>
            <span className="text-xs text-muted-foreground">
              ({counsellor.reviews})
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {counsellor.experience}+ years
          </span>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {counsellor.languages.map((lang) => (
            <Badge key={lang} variant="secondary" className="text-xs">
              {lang}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/counsellors/${counsellor.id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              View Profile
            </Button>
          </Link>
          <Link to={`/book?counsellor=${counsellor.id}`}>
            <Button variant="default" size="sm" className="gap-1">
              <Calendar className="h-4 w-4" />
              Book
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
