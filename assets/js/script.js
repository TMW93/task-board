const taskFormEl = $(`#task-form`);
const taskTitleInputEl = $(`#task-title`);
const dateInputEl = $(`#task-due-date`);
const taskDescriptInputEl = $(`#task-descript`);
const cardEl = $(`#to-do-cards`);
const inProgCard = $(`#in-progress-cards`);
const doneCard = $(`#done-cards`);

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
if(taskList === null) {
  taskList = [];
}
let nextId = JSON.parse(localStorage.getItem("nextId"));



// Todo: create a function to generate a unique task id
function generateTaskId() {

}

// Todo: create a function to create a task card
function createTaskCard(task) {
  // make a card to appear on webpage
  // cardEl.addClass(`card`);
  // let cardBodyEl = $(`<div>`);
  // cardBodyEl.addClass(`card-body`);
  // cardBodyEl.appendTo(cardEl);

  // let cardHeaderEl = $(`<h5>`);
  // cardHeaderEl.addClass(`card-title`);
  // cardHeaderEl.text(currentTask.taskTitle);
  // cardHeaderEl.appendTo(cardBodyEl);

  // let cardTextEl = $(`<p>`);
  // cardTextEl.addClass(`card-text`);
  // cardTextEl.text(currentTask.taskDescript);
  // cardTextEl.appendTo(cardBodyEl);

  // let cardDateEl = $(`<p>`);
  // cardDateEl.addClass(`card-text`);
  // cardDateEl.text(currentTask.taskDueDate);
  // cardDateEl.appendTo(cardBodyEl);

  // let cardDelete = $(`<btn>`);
  // cardDelete.text(`Delete`);
  // cardDelete.appendTo(cardBodyEl);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  let currentList = taskList;
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  event.preventDefault();
  let currentTask = {
    taskTitle: taskTitleInputEl.val(),
    taskDueDate: dateInputEl.val(),
    taskDescript: taskDescriptInputEl.val(),
  };

  if(!currentTask.taskTitle || !currentTask.taskDueDate || !currentTask.taskDescript) {
    $(`#formModal`).modal(`hide`);
    return;
  } else {
    console.log()
    // push recently input task to tasklist array and store in local storage
    taskList.push(currentTask);
    localStorage.setItem(`tasks`, JSON.stringify(taskList));

    $(`#formModal`).modal(`hide`);
  }
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

  // event listener for the add task button
  taskFormEl.on(`submit`, handleAddTask);
});
