import React, { useState } from 'react';
import { ArrowDown, Plus, Trash2, ChevronUp, ChevronDown, Save, Sparkles } from 'lucide-react';

const palette = {
  blue: 'border-blue-400/40 bg-blue-500/10',
  orange: 'border-orange-400/40 bg-orange-500/10',
  green: 'border-emerald-400/40 bg-emerald-500/10',
  purple: 'border-violet-400/40 bg-violet-500/10'
};
const makeStep = (i) => ({ id: `${Date.now()}-${i}`, title: `New roadmap step ${i + 1}`, description: 'Add what the learner should understand or build.', color: 'blue' });
export const starterRoadmap = [
  { id: 'fundamentals', title: 'Build the fundamentals', description: 'Core concepts, syntax and object-oriented programming.', color: 'blue' },
  { id: 'practice', title: 'Practice and problem solving', description: 'DSA patterns, small exercises and revision.', color: 'orange' },
  { id: 'project', title: 'Build a real project', description: 'Apply the concepts in a project with APIs and a database.', color: 'green' },
  { id: 'launch', title: 'Review and launch', description: 'Testing, GitHub portfolio, deployment and next steps.', color: 'purple' }
];

export function MentorBoard({ initialNodes = starterRoadmap, onSave, readOnly = false, compact = false }) {
  const [nodes, setNodes] = useState(initialNodes?.length ? initialNodes : starterRoadmap);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const change = (id, field, value) => setNodes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  const move = (index, direction) => setNodes(prev => { const next = [...prev]; const target = index + direction; if (target < 0 || target >= next.length) return prev; [next[index], next[target]] = [next[target], next[index]]; return next; });
  const save = async () => { if (!onSave) return; setSaving(true); setMessage(''); try { await onSave(nodes); setMessage('Saved successfully'); } catch (e) { setMessage(e.message || 'Could not save'); } finally { setSaving(false); } };
  return <section className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 md:p-6 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider"><Sparkles size={15}/> MentorBoard</div><h2 className="mt-1 text-xl font-black text-white">Visual learning roadmap</h2><p className="mt-1 text-sm text-slate-400">Turn advice into clear steps the learner can follow.</p></div>{!readOnly && <div className="flex gap-2"><button onClick={() => setNodes(p => [...p, makeStep(p.length)])} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold hover:border-orange-400"><Plus size={16}/> Add step</button>{onSave && <button disabled={saving} onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-bold text-white disabled:opacity-60"><Save size={16}/>{saving ? 'Saving…' : 'Save board'}</button>}</div>}</div>
    <div className={`mx-auto ${compact ? 'max-w-xl' : 'max-w-3xl'} space-y-2`}>
      {nodes.map((node, i) => <React.Fragment key={node.id}><article className={`rounded-xl border p-3 md:p-4 ${palette[node.color] || palette.blue}`}><div className="flex gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950/60 text-sm font-black text-white">{i + 1}</div><div className="min-w-0 flex-1 space-y-2">{readOnly ? <><h3 className="font-bold text-white">{node.title}</h3><p className="text-sm text-slate-300">{node.description}</p></> : <><input value={node.title} maxLength={120} onChange={e => change(node.id, 'title', e.target.value)} aria-label={`Step ${i + 1} title`} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 font-bold text-white outline-none focus:border-orange-400"/><textarea value={node.description} maxLength={500} onChange={e => change(node.id, 'description', e.target.value)} aria-label={`Step ${i + 1} description`} rows={2} className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-300 outline-none focus:border-orange-400"/><div className="flex flex-wrap items-center gap-2"><label className="text-xs text-slate-400">Color <select value={node.color || 'blue'} onChange={e => change(node.id, 'color', e.target.value)} className="ml-1 rounded bg-slate-950 px-2 py-1 text-slate-200"><option value="blue">Blue</option><option value="orange">Orange</option><option value="green">Green</option><option value="purple">Purple</option></select></label><div className="ml-auto flex gap-1"><button title="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1.5 text-slate-300 hover:bg-slate-800 disabled:opacity-30"><ChevronUp size={16}/></button><button title="Move down" disabled={i === nodes.length - 1} onClick={() => move(i, 1)} className="rounded p-1.5 text-slate-300 hover:bg-slate-800 disabled:opacity-30"><ChevronDown size={16}/></button><button title="Delete step" onClick={() => setNodes(p => p.filter(n => n.id !== node.id))} className="rounded p-1.5 text-red-300 hover:bg-red-500/10"><Trash2 size={16}/></button></div></div></>}</div></div></article>{i < nodes.length - 1 && <div className="flex justify-center py-0.5 text-slate-500"><ArrowDown size={20}/></div>}</React.Fragment>)}
    </div>{message && <p role="status" className="text-sm text-emerald-300">{message}</p>}
  </section>;
}
