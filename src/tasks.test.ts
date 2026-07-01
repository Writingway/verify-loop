import { describe, it, expect } from "vitest";
import { createTask, completeTask, pending, updateTask } from "./tasks";

describe("tasks", () => {
  it("creates a task", () => {
    const t = createTask("learn loops");
    expect(t.done).toBe(false);
    expect(t.title).toBe("learn loops");
  });

  it("rejects empty title", () => {
    expect(() => createTask("  ")).toThrow();
  });

  it("completes a task", () => {
    const t = completeTask(createTask("x"));
    expect(t.done).toBe(true);
  });

  it("filters pending", () => {
    const a = createTask("a");
    const b = completeTask(createTask("b"));
    expect(pending([a, b])).toEqual([a]);
  });

  it("updates title, trims it, keeps other fields", () => {
    const t = createTask("old");
    const u = updateTask(t, { title: "  new  " });
    expect(u.title).toBe("new");
    expect(u.id).toBe(t.id);
    expect(u.done).toBe(false);
  });

  it("updates done, keeps title", () => {
    const t = createTask("stay");
    const u = updateTask(t, { done: true });
    expect(u.done).toBe(true);
    expect(u.title).toBe("stay");
  });

  it("rejects empty title on update", () => {
    const t = createTask("x");
    expect(() => updateTask(t, { title: "  " })).toThrow("title required");
  });

  it("does not mutate the original task", () => {
    const t = createTask("original");
    updateTask(t, { title: "changed", done: true });
    expect(t.title).toBe("original");
    expect(t.done).toBe(false);
  });
});
