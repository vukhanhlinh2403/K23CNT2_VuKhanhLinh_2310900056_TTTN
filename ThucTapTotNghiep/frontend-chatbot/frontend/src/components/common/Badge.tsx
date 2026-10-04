import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'gray';
  className?: string;
}

export function Badge({ children, variant = 'blue', className = '' }: BadgeProps) {
  const variantStyles = {
    blue: 'bg-pink-50 text-fuchsia-700 border-pink-200/60',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
    red: 'bg-red-50 text-red-700 border-red-200/60',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
