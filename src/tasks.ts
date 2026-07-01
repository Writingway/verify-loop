export interface Task {
  id: number;
  title: string;
  done: boolean;
}

let nextId = 1;

export function createTask(title: string): Task {
  if (!title.trim()) throw new Error('title required');
  return { id: nextId++, title: title.trim(), done: false };
}

export function syncNextId(tasks: Task[]): void {
  nextId = Math.max(0, ...tasks.map((t) => t.id)) + 1;
}

export function completeTask(task: Task): Task {
  return { ...task, done: true };
}

export function pending(tasks: Task[]): Task[] {
  return tasks.filter((t) => !t.done);
}
