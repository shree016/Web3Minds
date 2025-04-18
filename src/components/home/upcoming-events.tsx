
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

interface EventProps {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageSrc: string;
}

const events: EventProps[] = [
  {
    title: "Web Development Workshop",
    description: "Learn how to build modern web applications with React and Next.js",
    date: "May 10, 2023",
    time: "3:00 PM - 5:00 PM",
    location: "Tech Hub, Building A",
    category: "Workshop",
    imageSrc: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500&h=300"
  },
  {
    title: "AI Ethics Panel Discussion",
    description: "Join our panel of experts discussing the ethical implications of AI",
    date: "May 15, 2023",
    time: "6:00 PM - 8:00 PM",
    location: "Virtual",
    category: "Speaker Session",
    imageSrc: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=500&h=300"
  },
  {
    title: "Hackathon: Build for Good",
    description: "48-hour hackathon focused on solving social issues through technology",
    date: "June 3-5, 2023",
    time: "Starts at 9:00 AM",
    location: "Innovation Center",
    category: "Hackathon",
    imageSrc: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=500&h=300"
  }
];

function EventCard({ event }: { event: EventProps }) {
  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 hover:border-primary/50">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={event.imageSrc} 
          alt={event.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm">{event.category}</Badge>
      </div>
      
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 text-sm space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full">Register Now</Button>
      </CardFooter>
    </Card>
  );
}

export function UpcomingEvents() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join us for workshops, hackathons, and speaker sessions to learn, connect, and grow with our community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div 
              key={event.title} 
              className="animate-fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
}
