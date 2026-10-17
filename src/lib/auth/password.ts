import crypto from 'crypto';

const ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

/**
 * Securely hashes a plain text password using PBKDF2 with SHA-512 and a cryptographically random salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(32).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');
  return `pbkdf2:${ITERATIONS}:${salt}:${derivedKey}`;
}

/**
 * Validates a plaintext password against a stored PBKDF2 hash using timing-safe comparison.
 */
export function verifyPassword(password: string, combinedHash: string): boolean {
  if (!password || !combinedHash) return false;

  const parts = combinedHash.split(':');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
    return false;
  }

  const iterations = parseInt(parts[1], 10);
  const salt = parts[2];
  const originalKeyHex = parts[3];

  if (isNaN(iterations) || !salt || !originalKeyHex) {
    return false;
  }

  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, KEY_LEN, DIGEST).toString('hex');

  const bufA = Buffer.from(derivedKey, 'hex');
  const bufB = Buffer.from(originalKeyHex, 'hex');

  if (bufA.length !== bufB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}
