
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  avatarUrl?: string;
}

const testimonials: TestimonialProps[] = [
  {
    content: "Joining Wyde was one of the best decisions I made during college. The workshops and hackathons gave me practical experience that helped me land my dream job.",
    author: "Sarah Johnson",
    role: "Software Engineer at Google",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    content: "The mentorship I received through Wyde completely changed my career trajectory. I went from knowing basic HTML to becoming a full-stack developer in less than a year.",
    author: "Michael Chen",
    role: "Full-Stack Developer",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    content: "Wyde's community is incredibly supportive and diverse. I've made lifelong friends and professional connections that have been invaluable to my growth as a developer.",
    author: "Priya Sharma",
    role: "UI/UX Designer",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg"
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-card">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from students and professionals who have been part of our journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-card/50 backdrop-blur-sm border-primary/10 h-full animate-fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-6">
                  <svg width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/20">
                    <path d="M13.5 0C6.04416 0 0 6.04416 0 13.5C0 20.9558 6.04416 27 13.5 27H18V36H9C4.02944 36 0 31.9706 0 27V13.5C0 6.04416 6.04416 0 13.5 0Z" fill="currentColor"/>
                    <path d="M40.5 0C33.0442 0 27 6.04416 27 13.5C27 20.9558 33.0442 27 40.5 27H45V36H36C31.0294 36 27 31.9706 27 27V13.5C27 6.04416 33.0442 0 40.5 0Z" fill="currentColor"/>
                  </svg>
                </div>
                
                <p className="text-foreground mb-6 flex-grow">{testimonial.content}</p>
                
                <div className="flex items-center mt-auto">
                  {testimonial.avatarUrl && (
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-4 border border-border">
                      <img 
                        src={testimonial.avatarUrl} 
                        alt={testimonial.author} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
