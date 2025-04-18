
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Heart } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Community Learning Hub",
    description: "An open-source platform for sharing educational resources and connecting students with mentors.",
    image: "/placeholder.svg",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    github: "#",
    demo: "#",
    stars: 124,
    featured: true
  },
  {
    id: 2,
    title: "Event Management System",
    description: "A complete solution for managing tech events, workshops, and hackathons with registration and attendance tracking.",
    image: "/placeholder.svg",
    tags: ["TypeScript", "Next.js", "Prisma", "PostgreSQL"],
    github: "#",
    demo: "#",
    stars: 98,
    featured: true
  },
  {
    id: 3,
    title: "Campus Navigation App",
    description: "Mobile application that helps students navigate campus buildings and find the shortest routes between classes.",
    image: "/placeholder.svg",
    tags: ["React Native", "Firebase", "Google Maps API"],
    github: "#",
    demo: "#",
    stars: 67,
    featured: true
  },
  {
    id: 4,
    title: "Study Group Finder",
    description: "Web app that helps students find and create study groups for specific courses and subjects.",
    image: "/placeholder.svg",
    tags: ["Vue.js", "Firebase", "Tailwind CSS"],
    github: "#",
    demo: "#",
    stars: 45,
    featured: false
  },
  {
    id: 5,
    title: "Course Review Platform",
    description: "Platform for students to review and rate courses and professors to help others make informed decisions.",
    image: "/placeholder.svg",
    tags: ["Angular", "Spring Boot", "MySQL"],
    github: "#",
    demo: "#",
    stars: 53,
    featured: false
  },
  {
    id: 6,
    title: "Tech Club Dashboard",
    description: "Administrative dashboard for tech clubs to manage members, events, and resources.",
    image: "/placeholder.svg",
    tags: ["React", "Redux", "Express", "MongoDB"],
    github: "#",
    demo: "#",
    stars: 38,
    featured: false
  }
];

const ProjectCard = ({ project }: { project: typeof projects[0] }) => {
  return (
    <div className={`bg-card rounded-lg overflow-hidden border shadow transition-all duration-300 hover:shadow-md ${project.featured ? 'ring-2 ring-primary/20' : ''}`}>
      <div className="h-48 bg-muted flex items-center justify-center relative">
        {project.featured && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs py-1 px-2 rounded-full font-medium">
            Featured
          </div>
        )}
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <Badge key={tag} variant="outline" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>{project.stars}</span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Live Demo</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  return (
    <Layout>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary text-center p-3 text-transparent bg-clip-text animate-gradient-shift bg-[length:200%_auto]">
         This page is under construction<br></br> Please check back later.
        </h1>
      {/* <div className="container py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary text-transparent bg-clip-text animate-gradient-shift bg-[length:200%_auto]">
          Projects
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Explore the projects built by our community members
        </p>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects
              .filter(project => project.featured)
              .map(project => (
                <ProjectCard key={project.id} project={project} />
              ))
            }
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">All Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div> */}
    </Layout>
  );
};

export default Projects;
