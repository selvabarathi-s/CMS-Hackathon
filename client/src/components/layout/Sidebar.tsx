import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  Briefcase,
  GitCompare,
  Layers,
  MapPin,
  Award,
  BookOpen,
  Sparkles,
  User,
  Users,
  BarChart3,
  Flame,
  ArrowRight
} from 'lucide-react';

interface SidebarProps {
  onOpenMobileCompanion: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenMobileCompanion }) => {
  const { user, role, profile, targetCareer } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Compass, roles: ['student'] },
    { to: '/explore', label: 'Career Explorer', icon: Briefcase, roles: ['student', 'mentor', 'admin'] },
    { to: '/roadmap', label: 'Adaptive Roadmap', icon: MapPin, roles: ['student'] },
    { to: '/resources', label: 'Resource Hub', icon: BookOpen, roles: ['student', 'mentor', 'admin'] },
    { to: '/assessments', label: 'Assessment Arena', icon: Award, roles: ['student'] },
    { to: '/skills', label: 'Skill Gap Studio', icon: Layers, roles: ['student'] },
    { to: '/simulator', label: 'Career Simulator & Pivot', icon: GitCompare, roles: ['student', 'mentor', 'admin'] },
    { to: '/ai-mentor', label: 'AI Career Mentor', icon: Sparkles, roles: ['student', 'mentor', 'admin'], highlight: true },
    { to: '/mentor', label: 'Faculty Mentor Hub', icon: Users, roles: ['mentor', 'admin'] },
    { to: '/admin', label: 'Institutional Analytics', icon: BarChart3, roles: ['admin'] },
    { to: '/profile', label: 'Student Profile', icon: User, roles: ['student'] }
  ];

  const visibleNav = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="hidden md:flex w-64 flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0c1220]/95 p-4 min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <div className="space-y-6">
        {/* Active Target Career Mini-Badge */}
        {role === 'student' && targetCareer && user && (
          <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-gradient-to-br dark:from-blue-950/50 dark:to-slate-900 p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1">
                <Flame className="h-3 w-3 text-blue-600 dark:text-blue-400" /> Target Career
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {profile?.readinessScore?.overallPercentage || 60}%
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{targetCareer.title}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 capitalize">
              {targetCareer.discipline} • {profile?.readinessScore?.status || 'Building'}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Navigation Menu
          </div>
          {visibleNav.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                      : item.highlight
                      ? 'text-cyan-700 dark:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto rounded-full bg-cyan-100 dark:bg-cyan-500/20 px-1.5 py-0.2 text-[9px] text-cyan-700 dark:text-cyan-300 font-bold">
                    AI
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Mobile Companion Banner */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-3 text-left">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Mobile Companion</span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2.5 leading-relaxed">
          Scan QR to launch the PWA / APK on your smartphone with instant pairing.
        </p>
        <button
          onClick={onOpenMobileCompanion}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 py-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
        >
          <span>Open QR Sync</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </aside>
  );
};
