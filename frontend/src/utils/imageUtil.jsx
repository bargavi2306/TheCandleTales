export const getImageUrl = (url, fallback = 'https://via.placeholder.com/350') => {
  if (!url) return fallback;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${apiBaseUrl}${url}`;
};
