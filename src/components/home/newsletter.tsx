
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
    // Would typically show success message
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="rounded-2xl bg-gradient-card p-8 md:p-12 border border-primary/10 relative overflow-hidden">
          {/* Background animated elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-secondary/10 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDelay: "1s" }}/>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated with Our Newsletter
            </h2>
            <p className="text-muted-foreground mb-8">
              Get the latest updates on our events, workshops, and community activities delivered straight to your inbox.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/80 backdrop-blur-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="gradient">
                Subscribe
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
