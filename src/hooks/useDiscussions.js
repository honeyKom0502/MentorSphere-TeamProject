import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchDiscussions } from '../services/discussionService';
import { timeAgo } from '../utils/timeAgo';

// Loads discussions from the backend (MongoDB) and keeps them fresh by POLLING
// (not WebSockets). Polling pauses while the browser tab is hidden and is
// cleaned up on unmount / logout.

const POLL_INTERVAL_MS = 5000;
const LABEL_REFRESH_MS = 60000;

export function useDiscussions({ enabled, intervalMs = POLL_INTERVAL_MS }) {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [labelTick, setLabelTick] = useState(0);

  const rawRef = useRef([]);
  const signatureRef = useRef('');
  const inFlightRef = useRef(false);
  const abortRef = useRef(null);

  const commit = useCallback((list) => {
    const signature = JSON.stringify(list);
    // Only touch React state when something really changed (no needless re-renders).
    if (signature === signatureRef.current) return;
    signatureRef.current = signature;
    rawRef.current = list;
    setRaw(list);
  }, []);

  const refresh = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const list = await fetchDiscussions({ signal: controller.signal });
      commit(list);
      setError('');
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setError(err?.message || 'Unable to load discussions.');
    } finally {
      if (abortRef.current === controller) inFlightRef.current = false;
    }
  }, [commit]);

  // Add or replace a discussion returned by the server (after create / reply).
  // De-duplicates by id, so a poll that lands right after a post never shows it twice.
  const upsert = useCallback(
    (discussion) => {
      if (!discussion?.id) return;
      const current = rawRef.current;
      const exists = current.some((d) => d.id === discussion.id);
      commit(
        exists
          ? current.map((d) => (d.id === discussion.id ? discussion : d))
          : [discussion, ...current]
      );
    },
    [commit]
  );

  useEffect(() => {
    if (!enabled) {
      rawRef.current = [];
      signatureRef.current = '';
      setRaw([]);
      setError('');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    refresh().finally(() => {
      if (!cancelled) setLoading(false);
    });

    const poll = setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, intervalMs);

    const labels = setInterval(() => setLabelTick((n) => n + 1), LABEL_REFRESH_MS);

    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      clearInterval(poll);
      clearInterval(labels);
      document.removeEventListener('visibilitychange', onVisible);
      abortRef.current?.abort();
      inFlightRef.current = false;
    };
  }, [enabled, intervalMs, refresh]);

  const discussions = useMemo(
    () =>
      raw.map((d) => ({
        ...d,
        createdAtISO: d.createdAt,
        createdAt: timeAgo(d.createdAt),
        replies: (d.replies || []).map((r) => ({
          ...r,
          createdAtISO: r.createdAt,
          createdAt: timeAgo(r.createdAt)
        }))
      })),
    // labelTick forces "x mins ago" labels to refresh without refetching.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [raw, labelTick]
  );

  return { discussions, loading, error, refresh, upsert };
}
