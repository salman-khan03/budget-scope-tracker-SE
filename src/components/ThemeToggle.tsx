
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover-scale"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-neon-blue" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
