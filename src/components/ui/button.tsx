import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonStyles = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper hover:bg-ink/90",
        secondary: "border border-line bg-paper text-ink hover:bg-wash",
        ghost: "text-ink hover:bg-wash",
        danger: "text-due hover:bg-due-bg",
      },
    },
    defaultVariants: { variant: "secondary" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>;

export function Button({ variant, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonStyles({ variant }), className)} {...props} />;
}
