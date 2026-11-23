import { cn, formatDate, formatDateTime, relativeTime } from '../lib/utils';

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('handles conditional classes', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });

  it('deduplicates conflicting tailwind classes (last wins)', () => {
    const result = cn('p-2', 'p-4');
    expect(result).toBe('p-4');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});

describe('formatDate()', () => {
  it('returns em-dash for null', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('formats a valid ISO date string', () => {
    // 2024-06-15T00:00:00Z should produce a date string with "Jun" and "2024"
    const result = formatDate('2024-06-15T00:00:00.000Z');
    expect(result).toContain('2024');
    expect(result).toMatch(/Jun/);
  });

  it('formats another date correctly', () => {
    const result = formatDate('2023-01-01T12:00:00.000Z');
    expect(result).toContain('2023');
  });
});

describe('formatDateTime()', () => {
  it('returns em-dash for null', () => {
    expect(formatDateTime(null)).toBe('—');
  });

  it('includes hour and minute for a valid ISO string', () => {
    const result = formatDateTime('2024-03-10T14:30:00.000Z');
    // Should contain time digits somewhere — exact format varies by locale
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it('contains the month abbreviation', () => {
    const result = formatDateTime('2024-03-10T09:05:00.000Z');
    expect(result).toMatch(/Mar/);
  });
});

describe('relativeTime()', () => {
  it('returns em-dash for null', () => {
    expect(relativeTime(null)).toBe('—');
  });

  it('returns "just now" for a timestamp within 2 minutes', () => {
    const recent = new Date(Date.now() - 30 * 1000).toISOString();
    expect(relativeTime(recent)).toBe('just now');
  });

  it('returns minutes ago for 10 minutes back', () => {
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    expect(relativeTime(tenMinsAgo)).toBe('10m ago');
  });

  it('returns hours ago for 3 hours back', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(relativeTime(threeHoursAgo)).toBe('3h ago');
  });

  it('returns days ago for 2 days back', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(relativeTime(twoDaysAgo)).toBe('2d ago');
  });
});
