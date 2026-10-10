import * as React from "react";

export interface WarmTooltipProps {
  content?: React.ReactNode;
  shortcut?: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
  warmWindow?: number;
  surfaceColor?: string;
  inkColor?: string;
  size?: "sm" | "md" | "lg";
  radius?: number;
  gap?: number;
  arrow?: boolean;
  popDuration?: number;
  popScale?: number;
  popBlur?: number;
  showFuse?: boolean;
  longPress?: number;
  disabled?: boolean;
  className?: string;
}

export interface WarmTooltipGroupProps {
  delay?: number;
  warmWindow?: number;
  travel?: number;
  lean?: number;
  onWarmChange?: (warm: boolean) => void;
  children?: React.ReactNode;
}

export declare const WarmTooltipGroup: React.ForwardRefExoticComponent<
  WarmTooltipGroupProps & React.RefAttributes<{ reset: () => void }>
>;

declare const WarmTooltip: (props: WarmTooltipProps) => React.JSX.Element;
export default WarmTooltip;
