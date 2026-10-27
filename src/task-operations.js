function requireTaskList(tasks) {
  if (!Array.isArray(tasks)) {
    throw new TypeError("Tasks must be an array.");
  }
}

function requireTitle(title) {
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error("A title is required.");
  }
}

function findTaskIndex(tasks, taskId) {
  const index = tasks.findIndex((task) => task.id === taskId);
  if (index === -1) {
    throw new Error("The requested task was not found.");
  }
  return index;
}

export function createTask(
  { title, description = "" },
  createId = () => globalThis.crypto.randomUUID(),
) {
  requireTitle(title);
  if (typeof description !== "string") {
    throw new TypeError("Description must be text.");
  }

  return {
    id: createId(),
    title,
    description,
    status: "pending",
  };
}

export function filterTasks(tasks, filter = "all") {
  requireTaskList(tasks);
  if (!["all", "pending", "done"].includes(filter)) {
    throw new Error("Unsupported filter.");
  }
  if (filter === "all") {
    return [...tasks];
  }
  return tasks.filter((task) => task.status === filter);
}

export function updateTask(tasks, taskId, updates) {
  requireTaskList(tasks);
  if (updates === null || typeof updates !== "object") {
    throw new TypeError("Task updates must be an object.");
  }

  const index = findTaskIndex(tasks, taskId);
  const currentTask = tasks[index];
  const title = updates.title ?? currentTask.title;
  const description = updates.description ?? currentTask.description;
  requireTitle(title);
  if (typeof description !== "string") {
    throw new TypeError("Description must be text.");
  }

  return tasks.map((task, taskIndex) =>
    taskIndex === index ? { ...currentTask, title, description } : task,
  );
}

export function toggleTaskStatus(tasks, taskId) {
  requireTaskList(tasks);
  const index = findTaskIndex(tasks, taskId);

  return tasks.map((task, taskIndex) =>
    taskIndex === index
      ? {
          ...task,
          status: task.status === "done" ? "pending" : "done",
        }
      : task,
  );
}

export function deleteTask(tasks, taskId) {
  requireTaskList(tasks);
  findTaskIndex(tasks, taskId);
  return tasks.filter((task) => task.id !== taskId);
}
