"use strict";

const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const form = document.querySelector(".create-task-form");

document.addEventListener("DOMContentLoaded", renderTasks);
clearBtn.addEventListener("click", clearAllTasks);
taskList.addEventListener("click", handleTaskAction);
form.addEventListener("submit", createTask);

function getTasksFromLocalStorage() {
  return localStorage.getItem("tasks") !== null
    ? JSON.parse(localStorage.getItem("tasks"))
    : [];
}

function setTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createSingleTaskElement(task, id) {
  const li = document.createElement("li");
  li.className = "collection-item";
  li.appendChild(document.createTextNode(task));

  const deleteElement = document.createElement("span");

  deleteElement.className = "delete-item";

  deleteElement.innerHTML = '<i class="fa fa-remove"></i>';

  const editElement = document.createElement("span");
  editElement.className = "edit-item";
  editElement.innerHTML = '<i class="fa fa-edit"></i>';

  li.appendChild(deleteElement);
  li.appendChild(editElement);
  li.dataset.taskIndex = id;

  taskList.appendChild(li);
}

function renderTasks() {
  const tasks = getTasksFromLocalStorage();

  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    createSingleTaskElement(task.task, index);
  });
}

function handleTaskAction(event) {
  const deleteItem = event.target.closest(".delete-item");
  const editItem = event.target.closest(".edit-item");

  if (deleteItem) {
    const taskItem = deleteItem.parentNode;
    const taskIndex = parseInt(taskItem.dataset.taskIndex);
    if (confirm("Are you sure you want to delete this task?")) {
      removeTaskFromLocalStorage(taskIndex);
      taskItem.remove();
    }
  } else if (editItem) {
    const taskItem = editItem.parentNode;
    const taskIndex = parseInt(taskItem.dataset.taskIndex);
    editTask(taskItem, taskIndex);
  }
}

function editTask(taskItem, taskIndex) {
  const currentTaskText = taskItem.firstChild.textContent;

  const newTaskText = prompt("Enter a new text for the task!", currentTaskText);

  if (newTaskText !== null && newTaskText.trim() !== "") {
    const deleteItem = taskItem.querySelector(".delete-item");

    const editItem = taskItem.querySelector(".edit-item");

    taskItem.firstChild.textContent = newTaskText.trim();

    updateTaskInLocalStorage(taskIndex, newTaskText.trim());

    taskItem.appendChild(deleteItem);
    taskItem.appendChild(editItem);
  }
}

function updateTaskInLocalStorage(taskIndex, newTaskText) {
  const tasks = getTasksFromLocalStorage();
  tasks[taskIndex].task = newTaskText.trim();
  setTasksToLocalStorage(tasks);
  renderTasks();
}

function createTask(event) {
  event.preventDefault();
  if (taskInput.value.trim() === "") {
    return;
  }
  const tasks = getTasksFromLocalStorage();

  createSingleTaskElement(taskInput.value, tasks.length);

  storeTaskInLocalStorage(taskInput.value);

  taskInput.value = "";
}

function storeTaskInLocalStorage(task) {
  const tasks = getTasksFromLocalStorage();

  tasks.push({
    id: Date.now(),
    task,
  });

  setTasksToLocalStorage(tasks);
}

function clearAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    localStorage.clear();
    taskList.innerHTML = "";
  }
}

function removeTaskFromLocalStorage(taskIndex) {
  const tasks = getTasksFromLocalStorage();

  tasks.splice(taskIndex, 1);

  setTasksToLocalStorage(tasks);
}
