import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { id: "countdown", label: "Countdown" },
  { id: "social", label: "Community" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "challenge", label: "Challenge" },
  { id: "shame", label: "Wall of Shame" },
  { id: "team", label: "Team" },
  { id: "faq", label: "FAQ" },
];

export const NavAnchors = () => {
  return (
    <nav className="w-full max-w-5xl mx-auto sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavAnchors;


