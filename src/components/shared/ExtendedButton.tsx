// components/shared/ExtendedButton.tsx
import React from "react";
import Link from "next/link";
import { ArrowRight, Code, Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  link?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  external?: boolean; // for external links like GitHub
  loading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean; // render as a different element
}

export type { ButtonProps };

// Custom hook to manage button styles
function useButtonStyles(
  variant: ButtonProps["variant"],
  size: ButtonProps["size"]
) {
  const baseStyle = `
    inline-flex cursor-pointer items-center justify-center rounded-full font-medium 
    transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 group
    disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden
  `
    .replace(/\s+/g, " ")
    .trim();

  const sizes = {
    sm: "px-4 py-2 text-sm h-9",
    md: "px-6 py-3 text-base h-11",
    lg: "px-8 py-4 text-lg h-13",
  };

  const variants = {
    primary: `
      bg-primary text-primary-foreground hover:bg-primary/90 
      focus:ring-primary/30 shadow-lg shadow-primary/25 
      hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]
      before:absolute before:inset-0 before:bg-gradient-to-r 
      before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] 
      before:transition-transform before:duration-1000 before:ease-in-out
    `
      .replace(/\s+/g, " ")
      .trim(),

    secondary: `
      border-2 border-border bg-background/80 text-foreground backdrop-blur-sm 
      hover:bg-secondary hover:text-secondary-foreground hover:border-secondary/50
      focus:ring-secondary/30 hover:shadow-lg hover:scale-[1.02]
    `
      .replace(/\s+/g, " ")
      .trim(),

    outline: `
      border-2 border-primary text-primary bg-transparent 
      hover:bg-primary hover:text-primary-foreground 
      focus:ring-primary/30 hover:shadow-lg hover:scale-[1.02]
    `
      .replace(/\s+/g, " ")
      .trim(),

    ghost: `
      text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground 
      focus:ring-accent/30 hover:scale-[1.02]
    `
      .replace(/\s+/g, " ")
      .trim(),

    destructive: `
      bg-destructive text-destructive-foreground hover:bg-destructive/90 
      focus:ring-destructive/30 shadow-lg shadow-destructive/25 
      hover:shadow-xl hover:shadow-destructive/30 hover:scale-[1.02]
    `
      .replace(/\s+/g, " ")
      .trim(),
  };

  return {
    baseStyle,
    sizeStyle: sizes[size || "md"],
    variantStyle: variants[variant || "primary"],
  };
}

/**
 * ExtendedButton - A highly customizable button component with multiple variants and features
 *
 * @param children - Button content (default: "Get started")
 * @param link - URL to navigate to (default: "/signup")
 * @param className - Additional CSS classes
 * @param variant - Button style variant (default: "primary")
 * @param size - Button size (default: "md")
 * @param iconLeft - Icon to display on the left side
 * @param iconRight - Icon to display on the right side
 * @param external - Whether link opens in new tab (default: false)
 * @param loading - Shows loading spinner when true (default: false)
 * @param fullWidth - Makes button take full width (default: false)
 * @param asChild - Renders without Link wrapper (default: false)
 * @param disabled - Disables the button
 *
 * @example
 * // Basic usage
 * <ExtendedButton>Click me</ExtendedButton>
 *
 * @example
 * // With custom variant and loading state
 * <ExtendedButton variant="secondary" loading={isLoading}>
 *   Submit Form
 * </ExtendedButton>
 *
 * @example
 * // External link with custom icon
 * <ExtendedButton
 *   link="https://github.com"
 *   external
 *   variant="outline"
 *   iconLeft={<Github className="h-4 w-4" />}
 * >
 *   View on GitHub
 * </ExtendedButton>
 */
export function ExtendedButton({
  children = "Get started",
  link = "/signup",
  className = "",
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  external = false,
  loading = false,
  fullWidth = false,
  asChild = false,
  disabled,
  ...props
}: ButtonProps) {
  const { baseStyle, sizeStyle, variantStyle } = useButtonStyles(variant, size);

  // Default icons per variant
  const getDefaultIcon = (
    variant: ButtonProps["variant"],
    position: "left" | "right"
  ) => {
    const iconProps = "h-4 w-4";

    if (position === "left" && variant === "secondary") {
      return <Code className={iconProps} />;
    }

    if (
      position === "right" &&
      (variant === "primary" || variant === "outline")
    ) {
      return (
        <ArrowRight
          className={`${iconProps} transform transition-all duration-300 ease-in-out group-hover:translate-x-1`}
        />
      );
    }

    return null;
  };

  const iconLeftRender = iconLeft ?? getDefaultIcon(variant, "left");
  const iconRightRender = iconRight ?? getDefaultIcon(variant, "right");

  const buttonContent = loading ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      {children && <span className="ml-2">Loading...</span>}
    </>
  ) : (
    <>
      {iconLeftRender && <span className="mr-2">{iconLeftRender}</span>}
      {children}
      {iconRightRender && <span className="ml-2">{iconRightRender}</span>}
    </>
  );

  const buttonElement = (
    <button
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {buttonContent}
    </button>
  );

  // Return button without Link wrapper if asChild or no link
  if (asChild || !link) {
    return buttonElement;
  }

  // Return with Link wrapper
  return external ? (
    <Link
      className="cursor-pointer inline-block"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {buttonElement}
    </Link>
  ) : (
    <Link className="cursor-pointer inline-block" href={link}>
      {buttonElement}
    </Link>
  );
}

// Default export for easier importing
export default ExtendedButton;
