interface HeyMeIconProps {
  size?: number;
  className?: string;
}

export function HeyMeIcon({ size = 48, className = "" }: HeyMeIconProps) {
  return (
    <span 
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 ${className}`}
      style={{ width: size, height: size }}
    >
      <span 
        className="bg-white/90 rounded-full block" 
        style={{ width: size / 2, height: size / 2 }}
      />
    </span>
  );
}