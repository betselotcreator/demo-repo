import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "tasks.json");

function loadTasks() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

function nextId(tasks) {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map((t) => t.id)) + 1;
}

function addTask(description) {
  if (!description) {
    console.error('Usage: node index.js add "description"');
    process.exit(1);
  }
  const tasks = loadTasks();
  const task = {
    id: nextId(tasks),
    description,
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks(tasks);
  console.log(`Added task #${task.id}: ${task.description}`);
}

function listTasks() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('No tasks yet. Add one with: node index.js add "Do something"');
    return;
  }
  tasks.forEach((t) => {
    const box = t.done ? "[x]" : "[ ]";
    console.log(`${box} #${t.id}  ${t.description}`);
  });
}

function completeTask(id) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === Number(id));
  if (!task) {
    console.error(`No task with id ${id}`);
    process.exit(1);
  }
  task.done = true;
  saveTasks(tasks);
  console.log(`Marked task #${id} as done.`);
}

function removeTask(id) {
  const tasks = loadTasks();
  const exists = tasks.some((t) => t.id === Number(id));
  if (!exists) {
    console.error(`No task with id ${id}`);
    process.exit(1);
  }
  const remaining = tasks.filter((t) => t.id !== Number(id));
  saveTasks(remaining);
  console.log(`Removed task #${id}.`);
}

function main() {
  const [, , command, ...args] = process.argv;

  switch (command) {
    case "add":
      addTask(args.join(" "));
      break;
    case "list":
      listTasks();
      break;
    case "done":
      completeTask(args[0]);
      break;
    case "remove":
      removeTask(args[0]);
      break;
    default:
      console.log(`Task Manager CLI

Usage:
  node index.js add "<description>"
  node index.js list
  node index.js done <id>
  node index.js remove <id>
`);
  }
}

main();
