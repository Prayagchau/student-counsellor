import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CounsellorCard } from "@/components/cards/CounsellorCard";
import { counsellors } from "@/data/counsellors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

const specializations = [
  "All",
  "Career Counselling",
  "Engineering Admissions",
  "Medical & NEET",
  "MBA Admissions",
  "Study Abroad",
  "Placement Support",
];

export default function Counsellors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");

  const filteredCounsellors = counsellors.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = selectedSpecialization === "All" || 
      c.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase().split(" ")[0]);
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground md:text-5xl">
              Our Expert Counsellors
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Connect with verified career experts who specialize in your field of interest
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-card py-6">
        <div className="container-custom">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Specialization Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
              {specializations.map((spec) => (
                <Button
                  key={spec}
                  variant={selectedSpecialization === spec ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSpecialization(spec)}
                  className="whitespace-nowrap"
                >
                  {spec}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Counsellors Grid */}
      <section className="section-padding bg-pattern">
        <div className="container-custom">
          {filteredCounsellors.length > 0 ? (
            <>
              <p className="mb-8 text-muted-foreground">
                Showing {filteredCounsellors.length} counsellor{filteredCounsellors.length !== 1 ? "s" : ""}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCounsellors.map((counsellor) => (
                  <CounsellorCard key={counsellor.id} counsellor={counsellor} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                No counsellors found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialization("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
