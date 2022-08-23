export const getHashUrl = (url) => {
  const hash = url.split('/')[1];
  if ((hash) === 'shopCreate') {
    return '/';
  }

  return `/${hash}`;
};
