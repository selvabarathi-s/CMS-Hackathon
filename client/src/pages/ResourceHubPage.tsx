import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Resource } from '../../../shared/types';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Video,
  Code,
  FileText,
  FolderGit2,
  ExternalLink,
  Star,
  Clock,
  Sparkles,
  CheckCircle2,
  Check,
  Award,
  Zap,
  GraduationCap,
  Search,
  Layers,
  Compass
} from 'lucide-react';

export const ResourceHubPage: React.FC = () => {
  const { profile, targetCareer, refreshProfileData } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const studentId = profile?.id || 'student-selva';

  useEffect(() => {
    setLoading(true);
    api.getResources(studentId)
      .then(data => {
        setResources(data.resources || []);
        setCompletedIds(data.completedResourceIds || profile?.completedResourceIds || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load curated resources:', err);
        api.getRoadmap(studentId).then(rData => {
          const allRes: Resource[] = [];
          (rData.milestones || []).forEach(m => {
            (m.resources || []).forEach(r => {
              if (!allRes.some(existing => existing.id === r.id)) {
                allRes.push(r);
              }
            });
          });
          setResources(allRes);
          setCompletedIds(profile?.completedResourceIds || []);
          setLoading(false);
        });
      });
  }, [studentId, profile?.completedResourceIds]);

  const handleToggleComplete = async (resourceId: string) => {
    if (!profile) return;
    setUpdatingId(resourceId);

    try {
      const res = await api.completeResource(profile.id, resourceId);
      if (res.success) {
        setCompletedIds(res.completedResourceIds);

        if (res.isCompleted) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 }
            });
          } catch (e) {}
        }

        await refreshProfileData();
      }
    } catch (err) {
      console.error('Failed to update course completion:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Distinct providers list
  const availableProviders = ['all', ...Array.from(new Set(resources.map(r => r.provider).filter(Boolean)))];

  const filteredResources = resources.filter(r => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (providerFilter !== 'all' && r.provider !== providerFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchProvider = r.provider.toLowerCase().includes(q);
      const matchWhy = (r.whyRecommended || '').toLowerCase().includes(q);
      if (!matchTitle && !matchProvider && !matchWhy) return false;
    }
    return true;
  });

  const completedCount = resources.filter(r => completedIds.includes(r.id)).length;
  const progressPercent = resources.length > 0 ? Math.round((completedCount / resources.length) * 100) : 0;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-rose-500 dark:text-rose-400" />;
      case 'interactive':
        return <Code className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />;
      case 'article':
        return <FileText className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
      case 'repo':
        return <FolderGit2 className="h-4 w-4 text-purple-500 dark:text-purple-400" />;
      default:
        return <BookOpen className="h-4 w-4 text-amber-500 dark:text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Curated Courseware & Platform Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Verified industry learning platforms, university MOOCs, sandbox drills, and codebases calibrated for{' '}
            <strong className="text-blue-600 dark:text-blue-400">{targetCareer?.title || 'Your Target Career'}</strong>.
          </p>
        </div>

        {targetCareer && (
          <div className="self-start sm:self-auto rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>Target: {targetCareer.title}</span>
          </div>
        )}
      </div>

      {/* Dynamic Course Completion Tracker Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Course & Module Completion Progress
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Mark courses and labs complete as you study to continuously boost your verified readiness index.
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {completedCount} of {resources.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
              ({progressPercent}% Completed)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-2.5">
        {/* Platform Provider Chips */}
        {availableProviders.length > 2 && (
          <div className="flex overflow-x-auto pb-1 gap-1.5 scrollbar-none items-center">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1 shrink-0">
              <Compass className="h-3.5 w-3.5" /> Platform:
            </span>
            {availableProviders.slice(0, 10).map(prov => (
              <button
                key={prov}
                onClick={() => setProviderFilter(prov)}
                className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-all shrink-0 ${
                  providerFilter === prov
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {prov === 'all' ? 'All Platforms' : prov}
              </button>
            ))}
          </div>
        )}

        {/* Resource Type Tabs & Search */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex overflow-x-auto gap-1.5 pb-1 md:pb-0 scrollbar-none items-center">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1 shrink-0">
              <Layers className="h-3 w-3" /> Type:
            </span>
            {[
              { id: 'all', label: 'All Formats' },
              { id: 'interactive', label: 'Interactive Sandboxes' },
              { id: 'video', label: 'Video Masterclasses' },
              { id: 'article', label: 'Technical Guides' },
              { id: 'repo', label: 'GitHub Repositories' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  typeFilter === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search course, platform, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800"></div>
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center text-slate-500">
          No resources found matching your current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map(resource => {
            const isCompleted = completedIds.includes(resource.id);
            const isBusy = updatingId === resource.id;

            return (
              <div
                key={resource.id}
                className={`flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all glass-panel-hover ${
                  isCompleted
                    ? 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {getTypeIcon(resource.type)}
                      <span>{resource.type}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                          <Check className="h-3 w-3" /> Completed
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{resource.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {resource.title}
                    </h3>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Platform Provider: <strong className="text-slate-700 dark:text-slate-300">{resource.provider}</strong>
                    </div>
                  </div>

                  {resource.whyRecommended && (
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 p-2.5 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <p className="leading-snug">{resource.whyRecommended}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-3.5 w-3.5" />
                      {resource.durationMinutes} mins
                    </span>
                    <span className="capitalize text-[11px] font-semibold text-slate-400">
                      Level: {resource.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      <span>Launch Platform</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    <button
                      disabled={isBusy}
                      onClick={() => handleToggleComplete(resource.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5" />
                          <span>{isBusy ? 'Saving...' : 'Mark Done'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
