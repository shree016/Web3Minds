
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`relative h-9 w-9 rounded-full transition-all duration-300 ease-in-out ${className}`}
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] absolute rotate-0 scale-100 transition-all duration-300 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100'}`} />
      <Moon className={`h-[1.2rem] w-[1.2rem] absolute rotate-90 scale-0 transition-all duration-300 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
