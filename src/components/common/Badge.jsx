import React from 'react';

export const RoleBadge = ({ role, size = "md", className = "" }) => {
  const roleLower = (role || 'junior').toLowerCase();
  
  const styles = {
    junior: {
      bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      lightBg: 'light:bg-blue-50 light:text-blue-700 light:border-blue-200',
      label: 'Junior',
      dot: 'bg-blue-400'
    },
    senior: {
      bg: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
      lightBg: 'light:bg-orange-50 light:text-orange-700 light:border-orange-200',
      label: 'Senior',
      dot: 'bg-orange-400'
    },
    alumni: {
      bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      lightBg: 'light:bg-purple-50 light:text-purple-700 light:border-purple-200',
      label: 'Alumni',
      dot: 'bg-purple-400'
    }
  };

  const current = styles[roleLower] || styles.junior;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-semibold";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${current.lightBg} ${sizeClasses} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`} />
      {current.label}
    </span>
  );
};

export const SkillPill = ({ skill, onClick, active, onRemove, size = "md" }) => {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs";
  
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all ${sizeClasses} ${
        active 
          ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-sm shadow-blue-500/20' 
          : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-700/60 hover:text-white light:bg-slate-100 light:text-slate-700 light:border-slate-300'
      } ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
    >
      {skill}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-slate-400 hover:text-red-400"
        >
          ×
        </button>
      )}
    </span>
  );
};
