/**
 * Hashes a plain-text password with SHA-256 via the Web Crypto API
 * and returns the hex-encoded digest.
 *
 * This ensures passwords are never sent as plain text in request payloads.
 * The server must compare against the same SHA-256 hex representation.
 */
export async function hashPassword(plain: string): Promise<string> {
  const encoded = new TextEncoder().encode(plain);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
