import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClickButtonProps {
  onClick: () => void;
  isClicking: boolean;
}

export const ClickButton = ({ onClick, isClicking }: ClickButtonProps) => {
  return (
    <div
      className={cn(
        "relative h-64 w-64 rounded-full text-2xl font-bold shadow-lg transition-all duration-300 overflow-hidden",
        "active:scale-95",
        isClicking && "animate-click-bounce"
      )}
    >
      <img
        src="/NBNNN.gif"
        alt="Click animation"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Glow effect background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl animate-pulse-scale z-0" />
    </div>
  );
};
