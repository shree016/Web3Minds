import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Import the Supabase client

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  contact: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  university: z.string().min(2, {
    message: "University must be at least 2 characters.",
  }),
  interests: z.string().min(2, {
    message: "Please tell us why you are interested in this event.",
  }),
});

const Join = ({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      university: "",
      interests: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const { data: existingEmails, error: checkError } = await supabase
    .from("tblUsers")
    .select("email")
    .eq("email", values.email);

    
    

    // Insert data into Supabase
    const { data, error } = await supabase
      .from("tblUsers") // Replace 'registrations' with your table name
      .insert([
        {
          name: values.name,
          email: values.email,
          contact: values.contact,
          university: values.university,
          interests: values.interests,
        },
      ]);

      if (existingEmails.length > 0) {
        toast({ title: "This email is already entered.",
         
          });
       
       return;
     }
    if (error) {
     
      toast({
        title: "Error submitting the application",
        description: error.message,
      });
    } else {
      toast({
        title: "Application submitted!",
        description:
          "Thanks for your interest will send you a confirmation email if your application is accepted.",
      });
      setIsSubmitted(true);
      closeModal(); // Close the modal
      form.reset(); // Reset the form
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>WYDE</DialogTitle>
          <DialogDescription>
            Fill in the form to get registered for the event.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Mobile number" {...field} />
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
                  <FormLabel>Organization/University</FormLabel>
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
                  <FormLabel>Why do you want to attend this event?</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Web development, AI, design, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Once your application is accepted, you will receive a confirmation email.
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
      </DialogContent>
    </Dialog>
  );
};

export default Join;
