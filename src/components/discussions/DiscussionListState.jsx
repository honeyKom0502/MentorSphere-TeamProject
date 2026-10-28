import React from 'react';
import { AlertCircle, Loader2, MessageSquare, RefreshCw } from 'lucide-react';

// Shared loading / error / empty states for every discussion list.
export const DiscussionListState = ({
  loading,
  error,
  isEmpty,
  onRetry,
  emptyMessage = 'No questions yet. Be the first to ask one!'
}) => {
  if (loading && isEmpty) {
    return (
      <div className="p-8 flex items-center justify-center gap-2 text-xs text-slate-400 light:text-slate-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading discussions...</span>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div
          role="alert"
          className="p-3 mb-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 light:text-rose-700 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1 font-bold hover:underline shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          )}
        </div>
      )}

      {!error && !loading && isEmpty && (
        <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 light:border-slate-300 text-slate-400 light:text-slate-600 text-xs flex flex-col items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-400" />
          <span>{emptyMessage}</span>
        </div>
      )}
    </>
  );
};
