
import { useEffect, useState, useRef } from "react";
import { ChevronRight, Users, Calendar, Code, Award } from "lucide-react";

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
}

const stats = [
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    label: "Community Members",
    value: 500,
    suffix: "+",
    delay: 0
  },
  {
    icon: <Calendar className="w-6 h-6 text-primary" />,
    label: "Events Hosted",
    value: 75,
    delay: 200
  },
  {
    icon: <Code className="w-6 h-6 text-primary" />,
    label: "Open Source Projects",
    value: 30,
    delay: 400
  },
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    label: "Partner Organizations",
    value: 15,
    delay: 600
  }
];

function StatItem({ icon, label, value, suffix = "", delay = 0 }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const startTimestamp = performance.now();

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    setTimeout(() => {
      window.requestAnimationFrame(step);
    }, delay);

    return () => {
      setCount(0);
    };
  }, [value, isVisible, delay]);

  return (
    <div 
      ref={ref} 
      className="flex flex-col items-center p-6 bg-card rounded-lg border border-border/50 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-3 rounded-full bg-primary/10 mb-4">
        {icon}
      </div>
      <h3 className="text-3xl font-bold mb-2">
        {count}
        {suffix}
      </h3>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
