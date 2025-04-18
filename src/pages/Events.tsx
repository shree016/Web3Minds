
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const eventCategories = ["All", "Workshops", "Hackathons", "Talks", "Networking"];

const events = [
  {
    id: 1,
    title: "React State Management Workshop",
    date: "May 15, 2025",
    time: "3:00 PM - 5:00 PM",
    location: "Tech Hub, Building 3",
    category: "Workshops",
    attendees: 45,
    image: "/placeholder.svg",
    description: "Learn modern state management techniques in React with Redux Toolkit, Context API, and Zustand.",
    isUpcoming: true,
  },
  {
    id: 2,
    title: "Summer Hackathon 2025",
    date: "June 10-12, 2025",
    time: "48 hours",
    location: "Innovation Center",
    category: "Hackathons",
    attendees: 120,
    image: "/placeholder.svg",
    description: "Our flagship annual hackathon with prizes worth $5000. Open to all skill levels!",
    isUpcoming: true,
  },
  {
    id: 3,
    title: "Tech Career Panel",
    date: "April 28, 2025",
    time: "6:00 PM - 8:00 PM",
    location: "Virtual (Zoom)",
    category: "Talks",
    attendees: 78,
    image: "/placeholder.svg",
    description: "Industry professionals share insights about breaking into tech and career progression.",
    isUpcoming: true,
  },
  {
    id: 4,
    title: "AI in Healthcare Symposium",
    date: "March 12, 2025",
    time: "1:00 PM - 6:00 PM",
    location: "Medical Sciences Building",
    category: "Talks",
    attendees: 93,
    image: "/placeholder.svg",
    description: "Exploring the intersection of artificial intelligence and healthcare innovations.",
    isUpcoming: false,
  },
  {
    id: 5,
    title: "Web3 Development Bootcamp",
    date: "February 5-7, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Tech Innovation Lab",
    category: "Workshops",
    attendees: 32,
    image: "/placeholder.svg",
    description: "Three-day intensive bootcamp on blockchain development and decentralized applications.",
    isUpcoming: false,
  },
  {
    id: 6,
    title: "Winter Networking Mixer",
    date: "January 20, 2025",
    time: "7:00 PM - 10:00 PM",
    location: "The Hub Lounge",
    category: "Networking",
    attendees: 65,
    image: "/placeholder.svg",
    description: "Connect with fellow tech enthusiasts and industry professionals in a casual setting.",
    isUpcoming: false,
  }
];

const EventCard = ({ event }: { event: typeof events[0] }) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 bg-muted flex items-center justify-center">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <div className="mb-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {event.category}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{event.attendees} attendees</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {event.description}
        </p>
        <Button variant={event.isUpcoming ? "gradient" : "outline"} className="w-full">
          {event.isUpcoming ? "Register Now" : "View Recap"}
        </Button>
      </div>
    </div>
  );
};

const Events = () => {
  return (
    <Layout>
      <div className="container py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary text-transparent bg-clip-text animate-gradient-shift bg-[length:200%_auto]">
          Events
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Join us for workshops, hackathons, talks, and more!
        </p>

        <Tabs defaultValue="upcoming" className="mb-10">
          <TabsList className="mb-8">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {eventCategories.map((category) => (
                <Button key={category} variant="outline" size="sm">
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter(event => event.isUpcoming)
                .map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter(event => !event.isUpcoming)
                .map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Events;
