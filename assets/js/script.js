const taskFormEl = $(`#task-form`);
const taskTitleInputEl = $(`#task-title`);
const dateInputEl = $(`#task-due-date`);
const taskDescriptInputEl = $(`#task-descript`);
const todoCard = $(`#to-do-cards`);
const inProgCard = $(`#in-progress-cards`);
const doneCard = $(`#done-cards`);

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {

}

// Todo: create a function to create a task card
function createTaskCard(task) {

  let currentTask = {
    taskTitle: taskTitleInputEl.val(),
    taskDueDate: dateInputEl.val(),
    taskDescript: taskDescriptInputEl.val(),
  };

  if(!currentTask.taskTitle || !currentTask.taskDueDate || !currentTask.taskDescript) {
    return;
  } else {
    taskList.push(currentTask);
    localStorage.setItem(`tasks`, JSON.stringify(taskList));
  }
}

taskFormEl.on(`submit`, createTaskCard);

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  let currentList = taskList;
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // changes the date input from text to a calendar
  dateInputEl.datepicker({
    changeMonth: true,
    changeYear: true
  });
});
