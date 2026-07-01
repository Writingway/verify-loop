import { completeTask, createTask, pending, type Task } from "./tasks";

let tasks: Task[] = [];

const input = document.querySelector<HTMLInputElement>("#new-task")!;
const addButton = document.querySelector<HTMLButtonElement>("#add")!;
const list = document.querySelector<HTMLUListElement>("#list")!;
const pendingCount = document.querySelector<HTMLSpanElement>("#pending-count")!;

function render(): void {
  list.replaceChildren(
    ...tasks.map((task) => {
      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.disabled = task.done;
      checkbox.addEventListener("change", () => {
        tasks = tasks.map((t) => (t.id === task.id ? completeTask(t) : t));
        render();
      });
      li.append(checkbox, ` ${task.title}`);
      return li;
    }),
  );
  pendingCount.textContent = String(pending(tasks).length);
}

addButton.addEventListener("click", () => {
  try {
    tasks.push(createTask(input.value));
  } catch {
    return; // titre vide : on ignore
  }
  input.value = "";
  render();
});

render();
