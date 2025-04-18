
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
}

const navItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Events", href: "/events" },
  { title: "Projects", href: "/projects" },
  { title: "Blog", href: "/blog" },
  { title: "Partners", href: "/partners" },
  { title: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-lg bg-background/90 transition-all">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-gradient-primary text-transparent bg-clip-text font-bold text-xl animate-gradient-shift bg-[length:200%_auto]">
              WYDE
            </span>
          </Link>
        </div>

        {isMobile ? (
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
            <Link to="/join">
              <Button variant="gradient" size="sm">
                Join Us
              </Button>
            </Link>
          </nav>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm pt-16 animate-fade-in">
          <nav className="container py-8">
            <ul className="flex flex-col gap-6">
              {navItems.map((item, index) => (
                <li 
                  key={item.title} 
                  className={`animate-slide-in-right`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link
                    to={item.href}
                    className="text-xl font-medium block py-2 border-b border-muted transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li className="mt-4 animate-slide-in-right" style={{ animationDelay: `${navItems.length * 0.05}s` }}>
                <Link to="/join" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="gradient" className="w-full">
                    Join Us
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
