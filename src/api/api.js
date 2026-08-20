const API_BASE = '/api';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const parseResponseBody = async (response) => {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const getErrorMessage = (data) => {
  const rawError =
    data?.detail ||
    data?.message ||
    data?.non_field_errors?.[0] ||
    data?.username?.[0] ||
    data?.email?.[0];

  if (typeof rawError === 'string') {
    const lowered = rawError.toLowerCase();
    if (lowered.includes('proxy error') || lowered.includes('failed to fetch') || lowered.includes('network') || lowered.includes('not reachable')) {
      return 'The backend server is not reachable. Please start the Django API and try again.';
    }
    return rawError;
  }

  return 'Request failed';
};

const request = async (path, options = {}) => {
  const method = options.method?.toUpperCase() || 'GET';
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (method !== 'GET') {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers,
      ...options,
      method,
    });
  } catch (error) {
    throw new Error('Unable to reach the server. Please check your connection and try again.');
  }

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data;
};

export const login = (payload) => request('/login/', { method: 'POST', body: JSON.stringify(payload) });
export const logout = () => request('/logout/', { method: 'POST' });
export const register = (payload) => request('/register/', { method: 'POST', body: JSON.stringify(payload) });
export const fetchCurrentUser = () => request('/auth/user/');
export const fetchCourses = () => request('/courses/');
export const createCourse = (payload) => request('/courses/', { method: 'POST', body: JSON.stringify(payload) });
export const enrollInCourse = (courseId) => request(`/courses/${courseId}/enroll/`, { method: 'POST' });
