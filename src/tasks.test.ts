import { describe, it, expect } from 'vitest';
import { createTask, completeTask, pending } from './tasks';

describe('tasks', () => {
  it('creates a task', () => {
    const t = createTask('learn loops');
    expect(t.done).toBe(false);
    expect(t.title).toBe('learn loops');
  });

  it('rejects empty title', () => {
    expect(() => createTask('  ')).toThrow();
  });

  it('completes a task', () => {
    const t = completeTask(createTask('x'));
    expect(t.done).toBe(true);
  });

  it('filters pending', () => {
    const a = createTask('a');
    const b = completeTask(createTask('b'));
    expect(pending([a, b])).toEqual([a]);
  });
});
