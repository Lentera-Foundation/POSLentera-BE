export const expiredAt = () => {
  const now = new Date();
  const expiredAt = new Date(now.getTime() + 5 * 60000);
  return expiredAt;
};
