import { useEffect, useState } from "react";

interface ClickCounterProps {
  count: number;
}

export const ClickCounter = ({ count }: ClickCounterProps) => {
  const [displayCount, setDisplayCount] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count !== displayCount) {
      setIsAnimating(true);
      setDisplayCount(count);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count, displayCount]);

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-semibold text-muted-foreground">
        Nut Count
      </h2>
      <div
        className={cn(
          "text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all",
          isAnimating && "animate-count-up"
        )}
      >
        {displayCount.toLocaleString()}
      </div>
    </div>
  );
};

// Import cn utility
import { cn } from "@/lib/utils";
