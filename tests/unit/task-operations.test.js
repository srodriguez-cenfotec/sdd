import assert from "node:assert/strict";
import test from "node:test";
import {
  createTask,
  deleteTask,
  filterTasks,
  toggleTaskStatus,
  updateTask,
} from "../../src/task-operations.js";

test("creates pending tasks with a stable id, required title, and optional description", () => {
  const task = createTask(
    { title: "Buy milk", description: "Oat milk" },
    () => "task-1",
  );

  assert.deepEqual(task, {
    id: "task-1",
    title: "Buy milk",
    description: "Oat milk",
    status: "pending",
  });
});

test("defaults an omitted task description to empty text", () => {
  const task = createTask({ title: "Call Sam" }, () => "task-2");

  assert.equal(task.description, "");
  assert.equal(task.status, "pending");
});

test("rejects empty or whitespace-only titles", () => {
  assert.throws(() => createTask({ title: "" }), /title is required/i);
  assert.throws(() => createTask({ title: " \t " }), /title is required/i);
});

test("filters all, pending, and done tasks", () => {
  const tasks = [
    { id: "1", title: "Pending", description: "", status: "pending" },
    { id: "2", title: "Done", description: "", status: "done" },
  ];

  assert.deepEqual(filterTasks(tasks, "all"), tasks);
  assert.deepEqual(filterTasks(tasks, "pending"), [tasks[0]]);
  assert.deepEqual(filterTasks(tasks, "done"), [tasks[1]]);
});

test("rejects an unsupported completion filter", () => {
  assert.throws(() => filterTasks([], "archived"), /unsupported filter/i);
});

test("updates a task title and description without changing its id or status", () => {
  const task = {
    id: "task-1",
    title: "Draft",
    description: "",
    status: "done",
  };

  assert.deepEqual(updateTask([task], "task-1", {
    title: "Review",
    description: "Proofread",
  }), [
    {
      id: "task-1",
      title: "Review",
      description: "Proofread",
      status: "done",
    },
  ]);
});

test("rejects invalid update titles and unknown task IDs", () => {
  const tasks = [
    { id: "task-1", title: "Draft", description: "", status: "pending" },
  ];

  assert.throws(
    () => updateTask(tasks, "task-1", { title: "  " }),
    /title is required/i,
  );
  assert.throws(
    () => updateTask(tasks, "missing", { title: "Review" }),
    /task was not found/i,
  );
});

test("toggles task completion between pending and done", () => {
  const pending = [
    { id: "task-1", title: "Draft", description: "", status: "pending" },
  ];

  const done = toggleTaskStatus(pending, "task-1");

  assert.equal(done[0].status, "done");
  assert.equal(toggleTaskStatus(done, "task-1")[0].status, "pending");
});

test("deletes only the task with the requested stable ID", () => {
  const tasks = [
    { id: "task-1", title: "Draft", description: "", status: "pending" },
    { id: "task-2", title: "Review", description: "", status: "done" },
  ];

  assert.deepEqual(deleteTask(tasks, "task-1"), [tasks[1]]);
});
