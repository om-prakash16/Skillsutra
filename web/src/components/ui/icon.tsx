import { type LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface IconProps extends React.ComponentPropsWithoutRef<"svg"> {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
}

export function Icon({ name, size = 16, color, className, ...props }: IconProps) {
  // @ts-ignore
  const LucideIcon = LucideIcons[name] as LucideIcon;

  if (!LucideIcon) {
    // Fallback to a default icon if not found
    const FallbackIcon = LucideIcons["HelpCircle"] as LucideIcon;
    return <FallbackIcon size={size} color={color} className={className} {...props} />;
  }

  return <LucideIcon size={size} color={color} className={className} {...props} />;
}
