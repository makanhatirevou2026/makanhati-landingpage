import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer select-none disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants: Record<string, string> = {
    primary:
      'bg-[#8B1A2B] text-white hover:bg-[#6E1522] focus-visible:ring-[#8B1A2B] shadow-sm hover:shadow-md',
    secondary:
      'bg-[#C9A84C] text-white hover:bg-[#A8893F] focus-visible:ring-[#C9A84C] shadow-sm hover:shadow-md',
    outline:
      'border-2 border-[#8B1A2B] text-[#8B1A2B] bg-transparent hover:bg-[#8B1A2B] hover:text-white focus-visible:ring-[#8B1A2B]',
    ghost:
      'bg-transparent text-[#8B1A2B] hover:bg-[#8B1A2B]/10 focus-visible:ring-[#8B1A2B]',
    whatsapp:
      'bg-[#25D366] text-white hover:bg-[#1EB656] focus-visible:ring-[#25D366] shadow-sm hover:shadow-md',
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
