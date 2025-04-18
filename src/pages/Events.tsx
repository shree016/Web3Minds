import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";

const events = [
  {
    id: 1,
    title: "Blockchain Basics Workshop",
    date: "May 15, 2025",
    time: "3:00 PM - 5:00 PM",
    location: "KLE SNC Campus",
    category: "Workshops",
    attendees: "300+",
    image: "https://media.istockphoto.com/id/963145218/photo/blockchain-financial-technology-concept-network-encrypted-chain-of-blocks-earth.jpg?s=612x612&w=0&k=20&c=k4QH9IS24y6zfPedyujLtUD6xlhY6vpZpAyukGmDQGU=",
    description: "Learn the fundamentals of blockchain technology and its applications.",
    isUpcoming: true,
  },
];

const EventCard = ({ event, openModal }: { event: typeof events[0], openModal: () => void }) => {
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
        <Button onClick={openModal} variant={event.isUpcoming ? "gradient" : "outline"} className="w-full">
          {event.isUpcoming ? "Register Now" : "View Recap"}
        </Button>
      </div>
    </div>
  );
};

const Events = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter(event => event.isUpcoming)
                .map(event => (
                  <EventCard key={event.id} event={event} openModal={openModal} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter(event => !event.isUpcoming)
                .map(event => (
                  <EventCard key={event.id} event={event} openModal={openModal} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pass the modal state and handler to the Join component */}
    </Layout>
  );
};

export default Events;
