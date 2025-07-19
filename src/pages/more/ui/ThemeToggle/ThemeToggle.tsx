import {type Theme, THEME_OPTIONS, useTheme} from "@/shared/lib/theme";
import {SegmentInput} from "@/shared/ui/tabs";

export const ThemeToggle = () => {
  const {theme, setTheme} = useTheme();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as Theme);
  };

  return <SegmentInput value={theme} onChange={handleThemeChange} options={THEME_OPTIONS} />;
};
