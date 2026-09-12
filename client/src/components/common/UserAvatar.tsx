import React from 'react';

interface UserAvatarProps {
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  role?: string;
}

const GRADIENTS = [
  'from-blue-600 to-indigo-600 text-white',
  'from-emerald-600 to-teal-600 text-white',
  'from-purple-600 to-pink-600 text-white',
  'from-amber-500 to-orange-600 text-white',
  'from-cyan-600 to-blue-600 text-white',
  'from-rose-600 to-pink-600 text-white',
  'from-violet-600 to-indigo-700 text-white',
  'from-teal-600 to-emerald-700 text-white'
];

function getInitials(name?: string): string {
  if (!name) return 'U';
  // Strip honorifics
  const cleanName = name
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.)\s+/i, '')
    .trim();

  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) {
    return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGradient(name?: string): string {
  if (!name) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

const SIZE_CLASSES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm font-bold',
  lg: 'h-12 w-12 text-base font-bold',
  xl: 'h-16 w-16 text-xl font-black'
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'User',
  size = 'md',
  className = '',
  role
}) => {
  const initials = getInitials(name);
  const gradient = getGradient(name);
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-sm select-none font-sans font-bold tracking-tight border border-white/20 dark:border-white/10 ${sizeClass} ${className}`}
      title={name}
      aria-label={name}
    >
      <span>{initials}</span>
      {role === 'placement_cell' && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
      )}
      {role === 'mentor' && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
      )}
      {role === 'admin' && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
      )}
    </div>
  );
};
