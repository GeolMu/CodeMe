import { HeyMeIcon } from "./HeyMeIcon";

interface HeyMeLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  showCursor?: boolean;
  showIcon?: boolean;
  animated?: boolean;
  theme?: "light" | "dark";
  className?: string;
}

export function HeyMeLogo({ 
  size = "md",
  showCursor = true,
  showIcon = false,
  animated = false,
  theme = "light",
  className = "" 
}: HeyMeLogoProps) {
  const sizeClasses = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
    "2xl": "text-6xl"
  };

  const iconSizes = {
    xs: 16,
    sm: 20,
    md: 32,
    lg: 48,
    xl: 64,
    "2xl": 80
  };

  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];
  const textColor = theme === "dark" ? "text-slate-200" : "text-slate-700";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {showIcon && (
        <HeyMeIcon size={iconSize} />
      )}
      
      <span className={`${sizeClass} font-bold tracking-tight inline-flex items-center`}>
        <span className={textColor}>Hey</span>
        <span className="ml-1 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
          Me
        </span>
        {showCursor && (
          <span className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-purple-500 bg-clip-text text-transparent blink-underscore">
            _
          </span>
        )}
      </span>
    </span>
  );
}