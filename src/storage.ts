import { readFile, writeFile } from 'node:fs/promises';
import { syncNextId, type Task } from './tasks';

export async function saveTasks(tasks: Task[], filePath: string): Promise<void> {
  await writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf-8');
}

export async function loadTasks(filePath: string): Promise<Task[]> {
  let text: string;
  try {
    text = await readFile(filePath, 'utf-8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
  const tasks = JSON.parse(text) as Task[];
  syncNextId(tasks);
  return tasks;
}
