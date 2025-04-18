
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";

interface ProjectProps {
  title: string;
  description: string;
  tags: string[];
  imageSrc: string;
  githubUrl: string;
  liveUrl?: string;
}

const projects: ProjectProps[] = [
  {
    title: "Community Portal",
    description: "A centralized platform for community resources, events, and discussions.",
    tags: ["React", "Node.js", "MongoDB"],
    imageSrc: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=500&h=300",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  },
  {
    title: "Code Library",
    description: "Open-source collection of code snippets, resources and tutorials.",
    tags: ["TypeScript", "Next.js", "Tailwind"],
    imageSrc: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=500&h=300",
    githubUrl: "https://github.com"
  },
  {
    title: "Mentor Match",
    description: "Platform connecting students with industry mentors for guidance and career advice.",
    tags: ["Vue", "Firebase", "Supabase"],
    imageSrc: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=500&h=300",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  }
];

export function ProjectsGallery() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Community Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore open-source projects built by our community members.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card 
              key={project.title} 
              className="overflow-hidden group border border-border/50 hover:border-primary/50 transition-all h-full flex flex-col animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={project.imageSrc} 
                  alt={project.title} 
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-semibold text-xl mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow">{project.description}</p>
                
                <div className="flex gap-3 mt-auto">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  
                  {project.liveUrl && (
                    <Button variant="default" size="sm" className="flex-1" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Explore All Projects
          </Button>
        </div>
      </div>
    </section>
  );
}
