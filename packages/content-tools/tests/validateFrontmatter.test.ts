import { describe, expect, it } from 'vitest';
import { validateDocMeta } from '../src/validateFrontmatter';

describe('validateDocMeta', () => {
  it('rejects missing required fields', () => {
    const result = validateDocMeta({ title: 'TCP' } as any);
    expect(result.ok).toBe(false);
    expect(result.errors).toContain('slug is required');
  });

  it('accepts valid network doc metadata', () => {
    const result = validateDocMeta({
      title: 'TCP 三次握手',
      slug: 'network/tcp-handshake',
      subject: 'network',
      track: 'system',
      tags: ['tcp', 'transport'],
      difficulty: 'basic',
      summary: '握手流程',
      updatedAt: '2026-04-05'
    });
    expect(result.ok).toBe(true);
  });
});
