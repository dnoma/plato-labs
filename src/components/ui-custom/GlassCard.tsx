
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard = ({ 
  children, 
  className, 
  hoverEffect = false,
  ...props 
}: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "rounded-xl glass-card p-6",
        hoverEffect && "hover-lift",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
