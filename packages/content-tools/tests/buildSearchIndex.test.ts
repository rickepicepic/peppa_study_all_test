import { describe, expect, it } from 'vitest';
import { buildSearchIndexFromDocs } from '../src/buildSearchIndex';

describe('buildSearchIndexFromDocs', () => {
  it('builds index items with required fields', () => {
    const docs = [
      {
        title: 'TCP Handshake',
        slug: 'network/tcp-handshake',
        summary: '连接建立过程',
        tags: ['tcp', 'handshake'],
        track: 'system'
      }
    ];

    const index = buildSearchIndexFromDocs(docs as any);

    expect(index).toHaveLength(1);
    expect(index[0]).toEqual(
      expect.objectContaining({
        title: 'TCP Handshake',
        slug: 'network/tcp-handshake',
        summary: '连接建立过程',
        track: 'system'
      })
    );
    expect(index[0].keywords).toContain('tcp');
  });

  it('includes tag and title keywords and removes duplicates', () => {
    const docs = [
      {
        title: 'TCP Handshake TCP',
        slug: 'network/tcp-handshake',
        summary: '连接建立过程',
        tags: ['tcp', 'transport', 'tcp'],
        track: 'system'
      }
    ];

    const [first] = buildSearchIndexFromDocs(docs as any);

    expect(first.keywords).toContain('tcp');
    expect(first.keywords).toContain('handshake');
    expect(first.keywords).toContain('transport');
    expect(first.keywords.filter((item: string) => item === 'tcp')).toHaveLength(1);
  });
});
