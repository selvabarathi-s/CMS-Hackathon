import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Resource } from '../../../shared/types';
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
  Filter
} from 'lucide-react';

export const ResourceHubPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Collect resources from seed or backend
    api.getRoadmap('student-maya').then(data => {
      const allRes: Resource[] = [];
      data.milestones.forEach(m => {
        m.resources.forEach(r => {
          if (!allRes.some(existing => existing.id === r.id)) {
            allRes.push(r);
          }
        });
      });
      setResources(allRes);
      setLoading(false);
    });
  }, []);

  const filteredResources = resources.filter(r => {
    if (typeFilter === 'all') return true;
    return r.type === typeFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-rose-400" />;
      case 'interactive':
        return <Code className="h-4 w-4 text-emerald-400" />;
      case 'article':
        return <FileText className="h-4 w-4 text-blue-400" />;
      case 'repo':
        return <FolderGit2 className="h-4 w-4 text-purple-400" />;
      default:
        return <BookOpen className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-400" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Curated Resource Hub
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          High-impact, filtered learning materials directly matched to your targeted skill gaps.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Resources' },
          { id: 'interactive', label: 'Interactive Sandboxes' },
          { id: 'video', label: 'Video Masterclasses' },
          { id: 'article', label: 'Technical Guides' },
          { id: 'repo', label: 'GitHub Repositories' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setTypeFilter(tab.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map(resource => (
          <div
            key={resource.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md glass-panel-hover"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 border border-slate-700">
                  {getTypeIcon(resource.type)}
                  <span>{resource.type}</span>
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{resource.rating}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {resource.title}
                </h3>
                <div className="text-[11px] text-slate-400 mt-1">
                  Provider: <strong className="text-slate-300">{resource.provider}</strong>
                </div>
              </div>

              {resource.whyRecommended && (
                <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="leading-snug">{resource.whyRecommended}</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5" />
                {resource.durationMinutes} mins
              </span>

              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 font-bold text-white transition-colors"
              >
                <span>Launch Resource</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
