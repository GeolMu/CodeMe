interface CodeMeLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  showCursor?: boolean;
  animated?: boolean;
  theme?: "light" | "dark";
  className?: string;
  showBrackets?: boolean;
}

export function CodeMeLogo({ 
  size = "md",
  showCursor = true,
  animated = false,
  theme = "light",
  className = "",
  showBrackets = true
}: CodeMeLogoProps) {
  const sizeClasses = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
    "2xl": "text-6xl"
  };

  const bracketSizeClasses = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
    "2xl": "text-6xl"
  };

  const sizeClass = sizeClasses[size];
  const bracketSizeClass = bracketSizeClasses[size];
  const textColor = theme === "dark" ? "text-slate-200" : "text-slate-700";
  const bracketColor = theme === "dark" ? "text-purple-400" : "text-purple-600";

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {showBrackets && (
        <span className={`${bracketSizeClass} ${bracketColor} font-bold`}>
          {'<>'}
        </span>
      )}
      <span className={`${sizeClass} ${textColor} font-bold transition-colors duration-300`}>
        Code:Me
      </span>
      {showCursor && (
        <span className={`${sizeClass} ${textColor} blink-underscore font-normal`}>
          _
        </span>
      )}
    </span>
  );
}