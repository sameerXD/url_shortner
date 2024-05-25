import crypto from 'crypto';

export const generateHash = (url: string): string => {
  return crypto.createHash('md5').update(url).digest('hex').slice(0, 8);
};
