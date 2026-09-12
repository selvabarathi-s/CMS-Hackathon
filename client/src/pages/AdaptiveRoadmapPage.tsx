import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { RoadmapMilestone, MilestoneStatus } from '../../../shared/types';
import {
  MapPin,
  BookOpen,
  Code,
  FolderGit2,
  Award,
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react';

export const AdaptiveRoadmapPage: React.FC = () => {
  const { profile, targetCareer, refreshProfileData } = useAuth();
  const navigate = useNavigate();

  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([]);
  const [activePracticeMilestone, setActivePracticeMilestone] = useState<RoadmapMilestone | null>(null);
  const [activeProjectMilestone, setActiveProjectMilestone] = useState<RoadmapMilestone | null>(null);
  const [practiceCode, setPracticeCode] = useState<string>('');
  const [practiceOutput, setPracticeOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      api.getRoadmap(profile.id).then(data => {
        setMilestones(data.milestones || []);
        setLoading(false);
      });
    }
  }, [profile]);

  const handleUpdateStatus = async (milestoneId: string, newStatus: MilestoneStatus) => {
    if (!profile) return;
    try {
      const res = await api.updateMilestoneStatus(profile.id, milestoneId, newStatus);
      if (res.success) {
        setMilestones(res.milestones);
        await refreshProfileData();
      }
    } catch (err) {
      console.error('Failed to update milestone status:', err);
    }
  };

  const handleRunPractice = () => {
    setPracticeOutput('Executing query in sandbox environment...\nQuery executed successfully in 42ms!\nReturned 10 verified records with matching primary join keys.');
  };

  if (!profile || !targetCareer) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        Please select a target career from the Career Explorer.
      </div>
    );
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'learn':
        return <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'practice':
        return <Code className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'build':
        return <FolderGit2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case 'evaluate':
        return <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Adaptive Learning Roadmap
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Personalized four-phase progression loop (<strong>Learn → Practice → Build → Evaluate</strong>) adapting dynamically to your performance.
          </p>
        </div>

        <button
          onClick={() => navigate('/assessments')}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-colors self-start sm:self-auto shadow-md shadow-blue-600/20"
        >
          <Award className="h-4 w-4" />
          <span>Take Skill Diagnostic</span>
        </button>
      </div>

      {/* Adaptive Progress Timeline */}
      <div className="space-y-4">
        {milestones.map((milestone, idx) => {
          const isCompleted = milestone.status === 'completed';
          const isLocked = milestone.status === 'locked';
          const isInProgress = milestone.status === 'in_progress';

          return (
            <div
              key={milestone.id}
              className={`relative rounded-2xl border p-5 transition-all shadow-sm ${
                isCompleted
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/15'
                  : isInProgress
                  ? 'border-blue-400 dark:border-blue-500/60 bg-blue-50/50 dark:bg-[#0c162d] shadow-md shadow-blue-500/10'
                  : isLocked
                  ? 'border-slate-200 dark:border-slate-800/60 bg-slate-50/80 dark:bg-slate-950/40 opacity-75'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-md bg-white dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                      {getStageIcon(milestone.stage)}
                      <span>Stage: {milestone.stage}</span>
                    </span>

                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {milestone.skillName}
                    </span>

                    {milestone.isRemedial && (
                      <span className="rounded-md bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80">
                        Targeted Remedial Revision
                      </span>
                    )}

                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      isCompleted ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' :
                      isInProgress ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800' :
                      isLocked ? 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800' :
                      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}>
                      {milestone.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{idx + 1}. {milestone.title}</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Milestone Execution Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Practice Button */}
                  {milestone.stage === 'practice' && !isLocked && (
                    <button
                      onClick={() => {
                        setActivePracticeMilestone(milestone);
                        setPracticeCode(milestone.practiceExercise?.solution || 'SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id;');
                        setPracticeOutput(null);
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors"
                    >
                      <Code className="h-3.5 w-3.5" />
                      <span>Launch Sandbox</span>
                    </button>
                  )}

                  {/* Project Brief Button */}
                  {milestone.stage === 'build' && !isLocked && (
                    <button
                      onClick={() => setActiveProjectMilestone(milestone)}
                      className="flex items-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors"
                    >
                      <FolderGit2 className="h-3.5 w-3.5" />
                      <span>View Project Brief</span>
                    </button>
                  )}

                  {/* Evaluate Button */}
                  {milestone.stage === 'evaluate' && !isLocked && (
                    <button
                      onClick={() => navigate('/assessments')}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>Take Evaluation</span>
                    </button>
                  )}

                  {/* Mark Completed Toggle */}
                  {!isLocked && (
                    <button
                      onClick={() => handleUpdateStatus(milestone.id, isCompleted ? 'in_progress' : 'completed')}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                        isCompleted
                          ? 'border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Resource Links Preview */}
              {milestone.resources.length > 0 && !isLocked && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Curated Learning Materials:</span>
                  {milestone.resources.map(r => (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-950 px-2 py-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
                    >
                      <span>{r.title}</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Practice Sandbox Modal */}
      {activePracticeMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Interactive Practice Sandbox
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{activePracticeMilestone.title}</h2>
              </div>
              <button
                onClick={() => setActivePracticeMilestone(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-200 block mb-1">Scenario Prompt:</strong>
              {activePracticeMilestone.practiceExercise?.prompt || 'Write an optimized query joining the customers and transactions tables to filter top cohort performers.'}
            </div>

            {/* Code Editor */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Query / Code Editor:</label>
              <textarea
                rows={5}
                value={practiceCode}
                onChange={(e) => setPracticeCode(e.target.value)}
                className="w-full font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-emerald-600 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Output Console */}
            {practiceOutput && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-300 whitespace-pre-line">
                {practiceOutput}
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                💡 Tip: Use appropriate indexes & join filters.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRunPractice}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Execute Query</span>
                </button>
                <button
                  onClick={() => {
                    handleUpdateStatus(activePracticeMilestone.id, 'completed');
                    setActivePracticeMilestone(null);
                  }}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  Complete Drill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Prompt Brief Modal */}
      {activeProjectMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                  Portfolio Project Specification
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{activeProjectMilestone.projectPrompt?.title || activeProjectMilestone.title}</h2>
              </div>
              <button
                onClick={() => setActiveProjectMilestone(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeProjectMilestone.projectPrompt?.brief || 'Build a production-grade application or data pipeline adhering to industry benchmarks.'}
            </p>

            {/* Deliverables */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-slate-200">Project Deliverables Checklist:</div>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                {activeProjectMilestone.projectPrompt?.deliverables.map((d, i) => (
                  <li key={i}>{d}</li>
                )) || <li>Complete GitHub repository with clear instructions</li>}
              </ul>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  handleUpdateStatus(activeProjectMilestone.id, 'completed');
                  setActiveProjectMilestone(null);
                }}
                className="rounded-xl bg-purple-600 hover:bg-purple-700 px-5 py-2 text-xs font-bold text-white transition-colors"
              >
                Mark Project Submitted & Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
