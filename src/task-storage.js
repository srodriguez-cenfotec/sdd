const STORAGE_KEY = "curso-pswe-07.tasks";

function isTask(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    (typeof value.description === "string" || value.description === undefined) &&
    (value.status === "pending" || value.status === "done")
  );
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

export function createTaskStorage(storageOrProvider = () => globalThis.localStorage) {
  const getStorage =
    typeof storageOrProvider === "function"
      ? storageOrProvider
      : () => storageOrProvider;

  return {
    loadTasks() {
      let serialized;

      try {
        serialized = getStorage().getItem(STORAGE_KEY);
      } catch (error) {
        throw new Error(`Unable to read saved tasks: ${errorMessage(error)}`, {
          cause: error,
        });
      }

      if (serialized === null) {
        return [];
      }

      let tasks;
      try {
        tasks = JSON.parse(serialized);
      } catch (error) {
        throw new Error("Unable to read stored task data: invalid JSON.", {
          cause: error,
        });
      }

      if (!Array.isArray(tasks) || !tasks.every(isTask)) {
        throw new Error("Unable to read stored task data: invalid task format.");
      }

      return tasks;
    },

    saveTasks(tasks) {
      if (!Array.isArray(tasks) || !tasks.every(isTask)) {
        throw new TypeError("Tasks must be an array of valid task records.");
      }

      try {
        getStorage().setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        throw new Error(`Unable to save tasks: ${errorMessage(error)}`, {
          cause: error,
        });
      }
    },
  };
}
