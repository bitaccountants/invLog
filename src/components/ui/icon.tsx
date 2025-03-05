import { icons } from "lucide-react";

interface IconProps {
  name: keyof typeof icons;
  size?: number;
  color?: string;
  className?: string;
}

export const Icon = ({
  name,
  size = 24,
  color = "currentColor",
  className,
}: IconProps) => {
  const LucideIcon = icons[name];

  return LucideIcon ? (
    <LucideIcon
      size={size}
      color={color}
      className={className}
    />
  ) : null;
};
