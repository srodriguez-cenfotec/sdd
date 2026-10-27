import assert from "node:assert/strict";
import test from "node:test";
import { createTaskStorage } from "../../src/task-storage.js";

class MemoryStorage {
  #values = new Map();

  getItem(key) {
    return this.#values.get(key) ?? null;
  }

  setItem(key, value) {
    this.#values.set(key, value);
  }
}

test("returns an empty task list when no saved value exists", () => {
  const storage = createTaskStorage(new MemoryStorage());

  assert.deepEqual(storage.loadTasks(), []);
});

test("saves and loads task data", () => {
  const storage = createTaskStorage(new MemoryStorage());
  const tasks = [
    { id: "task-1", title: "Buy milk", description: "", status: "pending" },
  ];

  storage.saveTasks(tasks);

  assert.deepEqual(storage.loadTasks(), tasks);
});

test("rejects malformed or invalid stored task data instead of treating it as empty", () => {
  const rawStorage = new MemoryStorage();
  rawStorage.setItem("curso-pswe-07.tasks", "{invalid json");

  const storage = createTaskStorage(rawStorage);

  assert.throws(() => storage.loadTasks(), /stored task data/i);
});

test("surfaces storage read failures", () => {
  const storage = createTaskStorage({
    getItem() {
      throw new Error("storage access denied");
    },
    setItem() {},
  });

  assert.throws(() => storage.loadTasks(), /storage access denied/);
});

test("surfaces storage write failures", () => {
  const storage = createTaskStorage({
    getItem() {
      return null;
    },
    setItem() {
      throw new Error("quota exceeded");
    },
  });

  assert.throws(() => storage.saveTasks([]), /quota exceeded/);
});
