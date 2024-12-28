import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

/**
 * SHA-256 해싱 함수 (salt 포함)
 * @param {string} plainText - 평문 텍스트
 * @param {string} [salt] - 추가적인 보안 강화를 위한 salt (옵션)
 * @return {string} salt와 해시된 문자열을 ':'로 구분하여 반환
 */
export const hashWithSHA256 = (plainText: string, salt?: string): string => {
  const effectiveSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .createHash('sha256')
    .update(effectiveSalt + plainText)
    .digest('hex');
  return `${effectiveSalt}:${hash}`;
};

/**
 * SHA-256 해시값 비교 함수 (salt 포함)
 * @param {string} plainText - 평문 텍스트
 * @param {string} hashedText - salt와 해시가 ':'로 구분된 문자열
 * @return {boolean} 평문 텍스트를 동일한 salt로 해싱한 값이 해시값과 동일한지 여부
 */
export const compareWithHashForSHA256 = (
  plainText: string,
  hashedText: string,
): boolean => {
  const [salt, originalHash] = hashedText.split(':');
  const hash = crypto
    .createHash('sha256')
    .update(salt + plainText)
    .digest('hex');
  return hash === originalHash;
};

/**
 * Hashes a plain text string using bcrypt.
 * @param {string} plainText - The plain text string to be hashed.
 * @return {Promise<string>} The hashed string.
 */
export const hashPlainText = (plainText: string): Promise<string> => {
  const saltOrRounds = 10;
  return bcrypt.hash(plainText, saltOrRounds);
};

/**
 * Compares a plain text string with a hashed string using bcrypt.
 * @param {string} plainText - The plain text string to compare.
 * @param {string} hashedText - The hashed string to compare.
 * @return {Promise<boolean>} Whether the plain text matches the hashed string.
 */
export const compareWithHash = (
  plainText: string,
  hashedText: string,
): Promise<boolean> => bcrypt.compare(plainText, hashedText);
