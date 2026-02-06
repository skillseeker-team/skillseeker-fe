// In development with Vite proxy, we can use relative paths.
// But if we want to support direct connections or other environments, we can configure it here.
// For this setup, we will rely on the Vite proxy for /api requests to avoid CORS.

export const headers = {
  'Content-Type': 'application/json',
};
