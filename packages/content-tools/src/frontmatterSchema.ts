export type TrackType = 'system' | 'interview';
export type SubjectType = 'network';

export interface DocMeta {
  title: string;
  slug: string;
  subject: SubjectType;
  track: TrackType;
  tags: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  summary: string;
  updatedAt: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}
