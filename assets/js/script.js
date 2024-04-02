const taskFormEl = $(`#task-form`);
const taskTitleInputEl = $(`#task-title`);
const dateInputEl = $(`#task-due-date`);
const taskDescriptInputEl = $(`#task-descript`);
const toDoEl = $(`#todo-cards`);
const inProgEl = $(`#in-progress-cards`);
const doneEl = $(`#done-cards`);
const toDoBox = $(`#to-do`);
const inProgBox = $(`#in-progress`);
const doneBox = $(`#done`);

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
if(taskList === null) {
  taskList = [];
}
let nextId = JSON.parse(localStorage.getItem("nextId"));

// get current date
let today = dayjs();

// Todo: create a function to generate a unique task id
function generateTaskId() {
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  let cardEl = $(`<div>`);
  cardEl.addClass(`card task-card`);
  cardEl.appendTo(toDoEl);
  
  let cardBodyEl = $(`<div>`);
  cardBodyEl.addClass(`card-body`);
  cardBodyEl.appendTo(cardEl);

  let cardHeaderEl = $(`<h5>`);
  cardHeaderEl.addClass(`card-title`);
  cardHeaderEl.text(task.taskTitle);
  cardHeaderEl.appendTo(cardBodyEl);

  let cardTextEl = $(`<p>`);
  cardTextEl.addClass(`card-text`);
  cardTextEl.text(task.taskDescript);
  cardTextEl.appendTo(cardBodyEl);

  let cardDateEl = $(`<p>`);
  cardDateEl.addClass(`card-text`);
  cardDateEl.text(task.taskDueDate);
  cardDateEl.appendTo(cardBodyEl);

  let cardDelete = $(`<button>`);
  cardDelete.addClass(`delete-button`);
  cardDelete.text(`Delete`);
  cardDelete.appendTo(cardBodyEl);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  //create cards
  let currentList = taskList;
  for(task in currentList) {
    createTaskCard(currentList[task]);
  }

  //make cards draggable
  $(`.task-card`).draggable({
    snap: `#todo-cards, #in-progress-cards, #done-cards`,
    stack: `.task-card`
  });
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
    //hide form after submit
    $(`#formModal`).modal(`hide`);
    //reset inputs after submit
    $(`#formModal`).on('hidden.bs.modal', function () {
      taskFormEl.trigger(`reset`);
    })
    //create a card for task
    createTaskCard(currentTask);
  }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  //remove the button's parent - the card
  $(this).parent().remove();

  //get the clicked button's index in thhe taskList array (not working)
  let index = $(this).index();
  console.log(`this is the elements index: ${index}`);
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  toDoEl.droppable({
    drop: function(e, ui) {
      $(ui.draggable).appendTo(toDoEl);
    }
  });
  inProgEl.droppable({
    drop: function(e, ui) {
      $(ui.draggable).appendTo(inProgEl);
    }
  });
  doneEl.droppable({
    drop: function(e, ui) {
      $(ui.draggable).appendTo(doneEl);
    }
  });
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // changes the date input from text to a calendar
  dateInputEl.datepicker({
    changeMonth: true,
    changeYear: true
  });

  //render task list
  renderTaskList();

  // make lanes droppable
  handleDrop();

  //make delete button work
  $(`.delete-button`).on(`click`, handleDeleteTask);

  // event listener for the add task button
  taskFormEl.on(`submit`, handleAddTask);
});
