import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import wydelogo2 from "@/public/assets/wydelogo2.png"; // Updated path

const navItems = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Events", href: "/events" },
  { title: "Projects", href: "/NotFound" },
  { title: "Blog", href: "/blog" },
  { title: "Partners", href: "/NotFound" },
  { title: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header
      className={cn(
        "sticky top-0 w-full border-b backdrop-blur-lg bg-background/900 transition-all",
        isMenuOpen ? "z-[99] backdrop-blur-lg" : "z-50"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-gradient-blue bg-clip-text font-bold text-xl animate-gradient-shift bg-[length:200%_auto]">
            <div className="flex items-center justify-center">
              <motion.img
                src={wydelogo2}
                alt="Logo"
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </span>
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="relative z-[100] hover:bg-transparent"
              style={{ color: "rgba(66,107,239,255)" }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        ) : (
          <nav className="flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <ThemeToggle />
          </nav>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 z-40  flex flex-col">
          {/* Background Blur and Dim Overlay */}
          <div
            className="absolute inset-0 z-10 bg-black/30  backdrop-blur-md backdrop-saturate-150 transition-all duration-300"
            onClick={toggleMenu}
          />

          {/* Mobile nav panel */}
          <nav className="relative z-20 pt-16 h-full w-full bg-black bg-[#2c3666]   text-white shadow-xl animate-fade-in">
            <div className="container bg-[#2c3666]  py-8">
              <ul className="flex flex-col gap-6">
                {navItems.map((item, index) => (
                  <li
                    key={item.title}
                    className="animate-slide-in-right text-center"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => {
                        setTimeout(() => setIsMenuOpen(false), 150);
                      }}
                      className="text-xl font-semibold block py-2 border-b border-white/20 transition-colors hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
