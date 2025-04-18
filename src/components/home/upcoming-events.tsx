
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

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
    title: "Blockchain Basics Workshop",
    description: "Learn the fundamentals of blockchain technology and its applications.",
    
    date: "May 10, 2023",
    time: "3:00 PM - 5:00 PM",
    location: "KLE SNC Campus",
    category: "Workshop",
     imageSrc : "https://media.istockphoto.com/id/963145218/photo/blockchain-financial-technology-concept-network-encrypted-chain-of-blocks-earth.jpg?s=612x612&w=0&k=20&c=k4QH9IS24y6zfPedyujLtUD6xlhY6vpZpAyukGmDQGU=" },
 
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
        <Link to="/events">
          <Button variant="outline" size="lg">
            View All Events
          </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
