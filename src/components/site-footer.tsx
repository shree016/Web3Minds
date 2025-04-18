
import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-bold bg-gradient-primary text-transparent bg-clip-text">WYDE</h3>
          <p className="text-muted-foreground">
            Built by students, for the world. A community focused on technology, learning, and growth.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold">Pages</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
            <li><Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">Events</Link></li>
            <li><Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">Projects</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Community</h4>
          <ul className="space-y-2">
            <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
            <li><Link to="/partners" className="text-muted-foreground hover:text-primary transition-colors">Partners</Link></li>
            <li><Link to="/join" className="text-muted-foreground hover:text-primary transition-colors">Join Us</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* <div className="space-y-4">
          <h4 className="font-semibold">Connect</h4>
          <p className="text-muted-foreground">
            Follow us on social media or join our newsletter to stay updated.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              GitHub
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              LinkedIn
            </a>
          </div>
        </div> */}
      </div>
      
      <div className="container mt-8 pt-8 border-t">
        {/* <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wyde. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
