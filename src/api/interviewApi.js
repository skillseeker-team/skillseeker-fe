import { headers } from './config';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
  }
  // 204 No Content
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

export const createInterview = async (data) => {
  const response = await fetch('/api/interviews', {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getInterviews = async () => {
  const response = await fetch('/api/interviews', {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
};

export const getInterviewById = async (id) => {
  const response = await fetch(`/api/interviews/${id}`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
};

export const deleteInterview = async (id) => {
  const response = await fetch(`/api/interviews/${id}`, {
    method: 'DELETE',
    headers,
  });
  return handleResponse(response);
};

export const generateFeedback = async (id) => {
  const response = await fetch(`/api/interviews/${id}/feedback:ai`, {
    method: 'POST',
    headers,
  });
  return handleResponse(response);
};

export const getFeedback = async (id) => {
  const response = await fetch(`/api/interviews/${id}/feedback`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
};
