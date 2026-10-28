import { apiRequest } from './api';
export const listMentors = async () => (await apiRequest('/api/sessions/mentors')).mentors;
export const listSessions = async () => (await apiRequest('/api/sessions')).sessions;
export const bookSession = async (payload) => (await apiRequest('/api/sessions', { method: 'POST', body: payload })).session;
export const updateSession = async (id, payload) => (await apiRequest(`/api/sessions/${id}`, { method: 'PATCH', body: payload })).session;
