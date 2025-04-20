
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import wydelogo2 from "@/public/assets/wydelogo2.png"; // Updated path

const words = ["Tech.", "Community.", "Innovation."];

export function HeroSection({ isMenuOpen }: { isMenuOpen: boolean }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const word = words[currentWordIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentLetterIndex < word.length) {
          setDisplayedText(word.substring(0, currentLetterIndex + 1));
          setCurrentLetterIndex(currentLetterIndex + 1);
          setTypingSpeed(100);
        } else {
          // Pause at the end of word
          setIsDeleting(true);
          setTypingSpeed(1000);
        }
      } else {
        // Deleting
        if (currentLetterIndex > 0) {
          setDisplayedText(word.substring(0, currentLetterIndex - 1));
          setCurrentLetterIndex(currentLetterIndex - 1);
          setTypingSpeed(50);
        } else {
          // Move to next word
          setIsDeleting(false);
          setCurrentWordIndex((currentWordIndex + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentWordIndex, currentLetterIndex, isDeleting, typingSpeed]);

  return (
    <section
    className={`relative py-7 md:py-10 overflow-hidden transition-all duration-300 ${
      isMenuOpen ? "blur-sm pointer-events-none select-none" : ""
    }`}
  >
      {/* Background gradient */}
      <div className="flex items-center justify-center ">
          <motion.img 
            src={wydelogo2} // Updated path
            alt="Logo 1" 
            className="w-44 h-44 md:w-44 md:h-44 lg:w-44 lg:h-44 object-contain"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        
         
          
        </div>
      
      <div className="absolute inset-0 bg-gradient-to-b   from-primary/5 to-background -z-10" />
      
      {/* Animated shapes */}
     
      
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70 animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-70 animate-pulse" />
      
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-10">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-gradient-card rounded-full mb-6 border border-primary/20">
              ✨ Built by students, for the world.
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl p-2 font-bold tracking-tighter mb-4">
              <span className="block mb-2">Empowering the next</span>
              <span className="bg-gradient-primary text-transparent p-2 bg-clip-text animate-gradient-shift bg-[length:200%_auto]">
                generation of innovators
              </span>
            </h1>
            
            <div className="h-16">
              <h2 className="text-2xl md:text-4xl font-semibold">
                <span>{displayedText}</span>
               
              </h2>
            </div>
            
            <p className="max-w-[700px] text-muted-foreground mx-auto mt-4 text-lg">
              Join a vibrant community of students and professionals passionate about technology, 
              learning, and building a better future through code.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {/* <Link to="/join">
              <Button size="lg" variant="gradient" className="group">
                Join our community
                <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link> */}
            {/* <Link to="/projects">
              <Button size="lg" variant="outline">
                Explore our projects
              </Button>
            </Link> */}
          </div>
          
          {/* <div className="flex items-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background bg-muted"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">500+</span> members have already joined
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
}

