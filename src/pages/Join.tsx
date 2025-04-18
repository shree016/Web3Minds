
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  university: z.string().min(2, {
    message: "University must be at least 2 characters.",
  }),
  interests: z.string().min(2, {
    message: "Please tell us what you're interested in.",
  }),
});

const Join = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      university: "",
      interests: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would connect to your backend
    console.log(values);
    
    // Show success toast
    toast({
      title: "Application submitted!",
      description: "Thanks for your interest in joining WYDE. We'll be in touch soon!",
    });
    
    // Open success dialog
    setIsSubmitted(true);
    
    // Reset form
    form.reset();
  }

  return (
    <Layout>
      <div className="container py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-primary text-transparent bg-clip-text animate-gradient-shift bg-[length:200%_auto]">
          Join WYDE
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Become a Part of Our Community</h2>
            <p className="text-lg mb-6">
              WYDE is a vibrant community of tech enthusiasts, developers, designers, and innovators. 
              By joining us, you'll get access to:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Workshops and hands-on learning sessions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Networking opportunities with industry professionals</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Collaborative projects to build your portfolio</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Mentorship from experienced developers</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Hackathon participation and team formation</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-card p-1 rounded-lg">
            <div className="bg-background rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Application Form</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University/College</FormLabel>
                        <FormControl>
                          <Input placeholder="Where do you study?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Areas of Interest</FormLabel>
                        <FormControl>
                          <Input placeholder="Web development, AI, design, etc." {...field} />
                        </FormControl>
                        <FormDescription>
                          What technologies or areas are you most excited about?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" variant="gradient" className="w-full">
                    Submit Application
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isSubmitted} onOpenChange={setIsSubmitted}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Received!</DialogTitle>
            <DialogDescription>
              Thanks for your interest in joining WYDE. Our team will review your application and get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button variant="default" onClick={() => setIsSubmitted(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Join;
