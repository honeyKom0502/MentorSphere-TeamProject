import { apiRequest } from './api';

export const fetchDiscussions = async ({ signal } = {}) => {
  const data = await apiRequest('/api/discussions', { signal });
  return data.discussions || [];
};

export const createDiscussion = async ({ channelId, title, content, tags, isAnonymous = true }) => {
  const data = await apiRequest('/api/discussions', {
    method: 'POST',
    body: { channelId, title, content, tags, isAnonymous }
  });
  return data.discussion;
};

export const createReply = async (discussionId, content, isAnonymous = true) => {
  const data = await apiRequest(
    `/api/discussions/${encodeURIComponent(discussionId)}/replies`,
    { method: 'POST', body: { content, isAnonymous } }
  );
  return { reply: data.reply, discussion: data.discussion };
};

export const deleteDiscussion = async (discussionId) => apiRequest(`/api/discussions/${encodeURIComponent(discussionId)}`, { method: 'DELETE' });

export const deleteReply = async (discussionId, replyId) => {
  const data = await apiRequest(`/api/discussions/${encodeURIComponent(discussionId)}/replies/${encodeURIComponent(replyId)}`, { method: 'DELETE' });
  return data.discussion;
};
