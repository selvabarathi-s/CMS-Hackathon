import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { CurriculumGapInsight } from '../../../shared/types';
import {
  BarChart3,
  ShieldCheck,
  AlertOctagon,
  Building2,
  TrendingUp,
  Plus,
  BookOpen,
  Users,
  CheckCircle2
} from 'lucide-react';

export const AdminHubPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [showAddGapModal, setShowAddGapModal] = useState(false);
  const [newGapData, setNewGapData] = useState({
    discipline: 'engineering',
    careerTitle: 'Data Analyst & BI Specialist',
    skillName: '',
    deficiencyPercentage: 65,
    suggestedIntervention: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminAnalytics().then(data => {
      setAnalytics(data);
      setLoading(false);
    });
  }, []);

  const handleCreateGap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGapData.skillName || !newGapData.suggestedIntervention) return;

    try {
      const res = await api.createCurriculumGap(newGapData as any);
      if (res.success) {
        setAnalytics((prev: any) => ({
          ...prev,
          curriculumGaps: [res.gap, ...prev.curriculumGaps]
        }));
        setShowAddGapModal(false);
        setNewGapData({
          discipline: 'engineering',
          careerTitle: 'Data Analyst & BI Specialist',
          skillName: '',
          deficiencyPercentage: 65,
          suggestedIntervention: ''
        });
      }
    } catch (err) {
      console.error('Failed to create curriculum gap:', err);
    }
  };

  if (loading || !analytics) {
    return <div className="p-8 text-center text-slate-400">Loading institutional intelligence...</div>;
  }

  const metrics = analytics.metrics;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-rose-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Institutional Curriculum & Intelligence Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Aggregate student readiness telemetry, detect curriculum skill deficiencies, and orchestrate institutional workshops.
          </p>
        </div>

        <button
          onClick={() => setShowAddGapModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Report Curriculum Gap</span>
        </button>
      </div>

      {/* Institutional KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Students Enrolled</div>
          <div className="text-2xl font-black text-white font-mono">{metrics.totalStudentsEnrolled}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Active on Roadmap</div>
          <div className="text-2xl font-black text-blue-400 font-mono">{metrics.activeOnRoadmap}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Job-Ready Index</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{metrics.highReadinessCount}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Active Interventions</div>
          <div className="text-2xl font-black text-amber-400 font-mono">{metrics.mentorInterventionsActive}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Campus Readiness Avg</div>
          <div className="text-2xl font-black text-cyan-400 font-mono">{metrics.averageReadinessIndex}%</div>
        </div>
      </div>

      {/* Curriculum Gap Insights Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-rose-400" />
            <span>Curriculum & Cohort Skill Gap Insights (Pattern Detection)</span>
          </h2>
          <span className="text-[10px] text-slate-400">Aggregated from diagnostic evaluations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.curriculumGaps.map((gap: CurriculumGapInsight) => (
            <div
              key={gap.id}
              className="rounded-xl border border-rose-900/50 bg-rose-950/15 p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-rose-950 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-800 uppercase">
                    {gap.deficiencyPercentage}% Deficiency
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {gap.studentCount} Students Affected
                  </span>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">{gap.careerTitle}</div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{gap.skillName}</h3>
                </div>

                <div className="rounded-lg bg-slate-950/80 p-2.5 border border-slate-800 text-xs text-slate-300">
                  <strong className="text-blue-300 block mb-1">Recommended Campus Action:</strong>
                  {gap.suggestedIntervention}
                </div>
              </div>

              <div className="pt-2 border-t border-rose-900/40 flex justify-end">
                <button
                  onClick={() => alert(`Workshop notification queued for ${gap.studentCount} students in ${gap.careerTitle}.`)}
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-rose-300 border border-slate-700 transition-colors"
                >
                  Schedule Workshop
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Curriculum Gap Modal */}
      {showAddGapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">
                  Curriculum Intelligence Report
                </span>
                <h2 className="text-lg font-bold text-white">Log Identified Skill Deficiency</h2>
              </div>
              <button
                onClick={() => setShowAddGapModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGap} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Academic Discipline:</label>
                <select
                  value={newGapData.discipline}
                  onChange={(e) => setNewGapData({ ...newGapData, discipline: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:outline-none"
                >
                  <option value="engineering">Engineering & Tech</option>
                  <option value="agriculture">Agriculture & AgTech</option>
                  <option value="paramedical">Paramedical & Health</option>
                  <option value="commerce">Commerce & FinTech</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Deficient Competency Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Statistical Hypothesis Testing"
                  value={newGapData.skillName}
                  onChange={(e) => setNewGapData({ ...newGapData, skillName: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Suggested Campus Intervention / Workshop:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Conduct a 2-week intensive hands-on lab..."
                  value={newGapData.suggestedIntervention}
                  onChange={(e) => setNewGapData({ ...newGapData, suggestedIntervention: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGapModal(false)}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2 font-bold text-white transition-colors"
                >
                  Save & Publish Gap Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
