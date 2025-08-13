import { LucideProps } from "lucide-react";

export interface AnimatedIconProps {
  delay?: number;
  finalPosition: { x: number; y: number };
  size?: number;
}

export interface IAnimatedHeroIcon {
  id: number | string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  angle: number;
  duration: number;
  delay: number;
  size: number;
}