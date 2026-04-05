import type { DocMeta, ValidationResult } from './frontmatterSchema';

export function validateDocMeta(meta: Partial<DocMeta>): ValidationResult {
  const errors: string[] = [];

  if (!meta.title) errors.push('title is required');
  if (!meta.slug) errors.push('slug is required');
  if (meta.subject !== 'network') errors.push('subject must be network');
  if (meta.track !== 'system' && meta.track !== 'interview') {
    errors.push('track must be system or interview');
  }
  if (!Array.isArray(meta.tags)) errors.push('tags must be array');
  if (!meta.summary) errors.push('summary is required');
  if (!meta.updatedAt) errors.push('updatedAt is required');

  return { ok: errors.length === 0, errors };
}
