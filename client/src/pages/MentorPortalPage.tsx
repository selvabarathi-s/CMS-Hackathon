import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { MentorIntervention } from '../../../shared/types';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Send,
  Plus,
  Clock,
  ShieldCheck,
  TrendingDown,
  GraduationCap
} from 'lucide-react';

export const MentorPortalPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [interventions, setInterventions] = useState<MentorIntervention[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [interventionNotes, setInterventionNotes] = useState('');
  const [interventionReason, setInterventionReason] = useState('high_uncertainty');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getMentorStudents(), api.getInterventions()]).then(([sData, iData]) => {
      setStudents(sData.students || []);
      setInterventions(iData.interventions || []);
      setLoading(false);
    });
  }, []);

  const handleCreateIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !interventionNotes.trim()) return;

    try {
      const res = await api.createIntervention({
        studentId: selectedStudent.id,
        reason: interventionReason,
        notes: interventionNotes.trim()
      });

      if (res.success) {
        setInterventions(prev => [res.intervention, ...prev]);
        setInterventionNotes('');
        setSelectedStudent(null);
      }
    } catch (err) {
      console.error('Failed to create intervention:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Faculty & Academic Mentor Hub
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Monitor assigned student cohort progress, detect early career uncertainty, and dispatch targeted mentor interventions.
        </p>
      </div>

      {/* Cohort Student Roster */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-400" />
          <span>Cohort Overview ({students.length} Students)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(s => {
            const hasFlags = s.flags.highUncertainty || s.flags.lowReadiness || s.flags.stalled;

            return (
              <div
                key={s.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-4 flex flex-col justify-between glass-panel-hover"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={s.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={s.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-white">{s.name}</h3>
                        <p className="text-[11px] text-slate-400">{s.degree}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Career:</span>
                      <strong className="text-blue-300 font-semibold">{s.targetCareer}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Career Readiness:</span>
                      <strong className="font-mono text-emerald-400">{s.readiness.overallPercentage}% ({s.readiness.status})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Academic CGPA:</span>
                      <span className="font-mono text-slate-200">{s.cgpa} / 10</span>
                    </div>
                  </div>

                  {/* Warning Flags */}
                  {hasFlags && (
                    <div className="space-y-1">
                      {s.flags.highUncertainty && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          <span>High Career Uncertainty ({s.uncertaintyScore}% score)</span>
                        </div>
                      )}
                      {s.flags.lowReadiness && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60">
                          <TrendingDown className="h-3 w-3 shrink-0" />
                          <span>Low Readiness Index (&lt;55%)</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 border border-slate-700 transition-colors"
                  >
                    Dispatch Intervention
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Interventions Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <span>Active Mentor Interventions & Case Notes</span>
        </h2>

        <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800 bg-slate-950">
          {interventions.map(interv => (
            <div key={interv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-white font-bold">{interv.studentName}</strong>
                  <span className="text-[10px] font-bold uppercase bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                    {interv.reason.replace('_', ' ')}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    interv.status === 'open' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {interv.status}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{interv.notes}</p>
                <div className="text-[10px] text-slate-500">Created: {interv.createdAt} • Target: {interv.targetCareer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Intervention Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                  Mentor Academic Intervention
                </span>
                <h2 className="text-lg font-bold text-white">Intervene for {selectedStudent.name}</h2>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIntervention} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Intervention Category:</label>
                <select
                  value={interventionReason}
                  onChange={(e) => setInterventionReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="high_uncertainty">High Career Uncertainty / Indecision</option>
                  <option value="persistent_gap">Persistent Critical Skill Deficit</option>
                  <option value="assessment_failure">Repeated Assessment Benchmark Failures</option>
                  <option value="inactivity">Roadmap Inactivity / Stalled Milestones</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Guidance & Actionable Notes for Student:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter specific feedback, suggested revision resources, or counseling schedule..."
                  value={interventionNotes}
                  onChange={(e) => setInterventionNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2 font-bold text-white transition-colors"
                >
                  Dispatch Intervention Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
