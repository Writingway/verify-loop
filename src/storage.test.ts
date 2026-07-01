import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTask } from './tasks';
import { loadTasks, saveTasks } from './storage';

describe('storage', () => {
  let dir: string;
  let file: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'tasks-'));
    file = join(dir, 'tasks.json');
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('round-trips tasks through save and load', async () => {
    const tasks = [createTask('a'), createTask('b')];
    await saveTasks(tasks, file);
    expect(await loadTasks(file)).toEqual(tasks);
  });

  it('returns empty list when file is missing', async () => {
    expect(await loadTasks(file)).toEqual([]);
  });

  it('creates ids above loaded max after load', async () => {
    await saveTasks([{ id: 42, title: 'old', done: false }], file);
    await loadTasks(file);
    expect(createTask('new').id).toBeGreaterThan(42);
  });
});
