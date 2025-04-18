
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

const ContactInfo = ({ icon, title, content }: { 
  icon: React.ReactNode, 
  title: string, 
  content: string 
}) => {
  return (
    <div className="flex gap-4">
      <div className="rounded-full bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-muted-foreground">{content}</p>
      </div>
    </div>
  );
};

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
  };

  return (
    <Layout>
      <div className="container py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary text-transparent bg-clip-text animate-gradient-shift bg-[length:200%_auto]">
          Contact Us
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Get in touch with the WYDE team
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">We're Here to Help</h2>
              <p className="text-muted-foreground mb-4">
                Have questions about our events, interested in partnership opportunities, or want to join our community? We'd love to hear from you!
              </p>
              <p className="text-muted-foreground mb-4">
                Fill out the form and we'll get back to you as soon as possible.
              </p>
            </div>
            
            <div className="space-y-6">
              <ContactInfo 
                icon={<Mail className="h-5 w-5" />}
                title="Email"
                content="contact@wydecommunity.com"
              />
              <ContactInfo 
                icon={<Phone className="h-5 w-5" />}
                title="Phone"
                content="+1 (555) 123-4567"
              />
              <ContactInfo 
                icon={<MapPin className="h-5 w-5" />}
                title="Office"
                content="Tech Innovation Building, University Campus, City, State 12345"
              />
              <ContactInfo 
                icon={<MessageSquare className="h-5 w-5" />}
                title="Social Media"
                content="@wydecommunity on Twitter, LinkedIn, and GitHub"
              />
            </div>
          </div>
          
          <div>
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" required />
                  </div>
                  
                  <div>
                    <Label>I'm interested in</Label>
                    <RadioGroup defaultValue="inquiry" className="grid grid-cols-2 gap-2 pt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="events" id="events" />
                        <Label htmlFor="events" className="cursor-pointer">Events</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="partnership" id="partnership" />
                        <Label htmlFor="partnership" className="cursor-pointer">Partnership</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="join" id="join" />
                        <Label htmlFor="join" className="cursor-pointer">Joining WYDE</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inquiry" id="inquiry" />
                        <Label htmlFor="inquiry" className="cursor-pointer">General Inquiry</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message..." className="min-h-32" required />
                  </div>
                </div>
                
                <Button type="submit" variant="gradient" className="w-full flex items-center justify-center">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>
            
            <div className="mt-6 p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                By submitting this form, you agree to our Privacy Policy. We'll never share your information with third parties without your consent.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Find Us</h2>
          <div className="h-80 bg-muted rounded-lg overflow-hidden">
            {/* In a real-world implementation, you'd add a Google Maps embed here */}
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center">
                <MapPin className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-medium">WYDE Headquarters</h3>
                <p className="text-muted-foreground">Map embed would be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
