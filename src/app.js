import {
  createTask,
  deleteTask,
  filterTasks,
  toggleTaskStatus,
  updateTask,
} from "./task-operations.js";
import { createTaskStorage } from "./task-storage.js";

const elements = {
  addTaskButton: document.querySelector("#add-task-button"),
  appError: document.querySelector("#app-error"),
  backButton: document.querySelector("#back-button"),
  deleteTaskButton: document.querySelector("#delete-task-button"),
  detailDescription: document.querySelector("#detail-description"),
  detailStatus: document.querySelector("#detail-status"),
  detailTitle: document.querySelector("#detail-title"),
  detailView: document.querySelector("#detail-view"),
  editTaskButton: document.querySelector("#edit-task-button"),
  emptyState: document.querySelector("#empty-state"),
  filterButtons: [...document.querySelectorAll("[data-filter]")],
  form: document.querySelector("#task-form"),
  formDialog: document.querySelector("#task-form-dialog"),
  formError: document.querySelector("#form-error"),
  formHeading: document.querySelector("#task-form-heading"),
  listView: document.querySelector("#list-view"),
  saveTaskButton: document.querySelector("#save-task-button"),
  statusButton: document.querySelector("#toggle-status-button"),
  taskDescription: document.querySelector("#task-description"),
  taskList: document.querySelector("#task-list"),
  taskTitle: document.querySelector("#task-title"),
  titleError: document.querySelector("#title-error"),
};

const taskStorage = createTaskStorage();
let tasks = [];
let currentFilter = "all";
let currentTaskId = null;
let editingTaskId = null;
let storageAvailable = false;

function showError(message, inForm = false) {
  const target = inForm ? elements.formError : elements.appError;
  target.textContent = message;
  target.hidden = false;
}

function clearErrors() {
  elements.appError.textContent = "";
  elements.appError.hidden = true;
  elements.formError.textContent = "";
  elements.formError.hidden = true;
  elements.titleError.textContent = "";
  elements.titleError.hidden = true;
  elements.taskTitle.removeAttribute("aria-invalid");
}

function setStorageControlsEnabled(enabled) {
  elements.addTaskButton.disabled = !enabled;
  for (const button of elements.filterButtons) {
    button.disabled = !enabled;
  }
}

function visibleStatus(status) {
  return status === "done" ? "Done" : "Pending";
}

function renderList() {
  if (!storageAvailable) {
    return;
  }

  for (const button of elements.filterButtons) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === currentFilter),
    );
  }

  const visibleTasks = filterTasks(tasks, currentFilter);
  elements.taskList.replaceChildren();

  if (visibleTasks.length === 0) {
    const emptyMessage =
      tasks.length === 0
        ? "No tasks yet. Add one to get started."
        : `No ${currentFilter} tasks yet.`;
    elements.emptyState.textContent = emptyMessage;
    elements.emptyState.hidden = false;
    return;
  }

  elements.emptyState.textContent = "";
  elements.emptyState.hidden = true;

  for (const task of visibleTasks) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const status = document.createElement("span");
    const title = document.createElement("span");

    button.type = "button";
    button.className = `task-row${task.status === "done" ? " is-done" : ""}`;
    status.className = `status-indicator${task.status === "done" ? " is-done" : ""}`;
    status.textContent = visibleStatus(task.status);
    title.className = "task-title";
    title.textContent = task.title;

    button.append(status, title);
    button.addEventListener("click", () => {
      currentTaskId = task.id;
      render();
    });
    item.append(button);
    elements.taskList.append(item);
  }
}

function renderDetail() {
  const task = tasks.find((item) => item.id === currentTaskId);
  if (!task) {
    currentTaskId = null;
    elements.detailView.hidden = true;
    elements.listView.hidden = false;
    elements.addTaskButton.hidden = false;
    renderList();
    return;
  }

  elements.detailTitle.textContent = task.title;
  const hasDescription = task.description.length > 0;
  elements.detailDescription.textContent = hasDescription
    ? task.description
    : "No description";
  elements.detailDescription.classList.toggle("is-empty", !hasDescription);
  elements.detailStatus.textContent = visibleStatus(task.status);
  elements.detailStatus.classList.toggle("is-done", task.status === "done");
  elements.statusButton.textContent =
    task.status === "done" ? "Mark as not done" : "Mark as done";

  elements.listView.hidden = true;
  elements.detailView.hidden = false;
  elements.addTaskButton.hidden = true;
}

function render() {
  if (currentTaskId === null) {
    elements.listView.hidden = false;
    elements.detailView.hidden = true;
    elements.addTaskButton.hidden = false;
    renderList();
    return;
  }
  renderDetail();
}

function persistTasks(nextTasks) {
  try {
    taskStorage.saveTasks(nextTasks);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save tasks.";
    showError(message, elements.formDialog.open);
    return false;
  }

  tasks = nextTasks;
  clearErrors();
  render();
  return true;
}

function openTaskForm(task = null) {
  clearErrors();
  editingTaskId = task?.id ?? null;
  elements.form.reset();
  elements.formHeading.textContent = task ? "Edit task" : "Add task";
  elements.saveTaskButton.textContent = task ? "Save changes" : "Create task";
  elements.taskTitle.value = task?.title ?? "";
  elements.taskDescription.value = task?.description ?? "";
  elements.formDialog.showModal();
  elements.taskTitle.focus();
}

function closeTaskForm() {
  if (elements.formDialog.open) {
    elements.formDialog.close();
  }
  editingTaskId = null;
  elements.form.reset();
  clearErrors();
}

function initialize() {
  try {
    tasks = taskStorage.loadTasks();
    storageAvailable = true;
    setStorageControlsEnabled(true);
    render();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to read saved tasks.";
    showError(message);
    setStorageControlsEnabled(false);
  }
}

elements.addTaskButton.addEventListener("click", () => openTaskForm());

for (const button of elements.filterButtons) {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderList();
  });
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const title = elements.taskTitle.value;
  const description = elements.taskDescription.value;
  if (title.trim().length === 0) {
    elements.titleError.textContent = "A title is required.";
    elements.titleError.hidden = false;
    elements.taskTitle.setAttribute("aria-invalid", "true");
    elements.taskTitle.focus();
    return;
  }

  let nextTasks;
  try {
    if (editingTaskId === null) {
      nextTasks = [...tasks, createTask({ title, description })];
    } else {
      nextTasks = updateTask(tasks, editingTaskId, { title, description });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update this task.";
    elements.titleError.textContent = message;
    elements.titleError.hidden = false;
    elements.taskTitle.setAttribute("aria-invalid", "true");
    return;
  }

  if (persistTasks(nextTasks)) {
    closeTaskForm();
    if (editingTaskId !== null) {
      currentTaskId = nextTasks.find((task) => task.id === editingTaskId)?.id ?? null;
      render();
    }
  }
});

elements.cancelFormButton = document.querySelector("#cancel-form-button");
elements.closeFormButton = document.querySelector("#close-form-button");
elements.cancelFormButton.addEventListener("click", closeTaskForm);
elements.closeFormButton.addEventListener("click", closeTaskForm);
elements.formDialog.addEventListener("close", () => {
  editingTaskId = null;
  elements.form.reset();
  clearErrors();
});

elements.backButton.addEventListener("click", () => {
  currentTaskId = null;
  clearErrors();
  render();
});

elements.editTaskButton.addEventListener("click", () => {
  const task = tasks.find((item) => item.id === currentTaskId);
  if (task) {
    openTaskForm(task);
  }
});

elements.statusButton.addEventListener("click", () => {
  const nextTasks = toggleTaskStatus(tasks, currentTaskId);
  persistTasks(nextTasks);
});

elements.deleteTaskButton.addEventListener("click", () => {
  if (!window.confirm("Delete this task? This action cannot be undone.")) {
    return;
  }

  const nextTasks = deleteTask(tasks, currentTaskId);
  if (persistTasks(nextTasks)) {
    currentTaskId = null;
    render();
  }
});

initialize();
