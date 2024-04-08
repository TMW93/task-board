const taskFormEl = $(`#task-form`);
const taskTitleInputEl = $(`#task-title`);
const dateInputEl = $(`#task-due-date`);
const taskDescriptInputEl = $(`#task-descript`);
const toDoEl = $(`#todo-cards`);
const inProgEl = $(`#in-progress-cards`);
const doneEl = $(`#done-cards`);
const cardBody = $(`.card-body`);
const cardBodyElOne = document.querySelectorAll(`.card-body`)[0];
const cardBodyElTwo = document.querySelectorAll(`.card-body`)[1];
const cardBodyElThree = document.querySelectorAll(`.card-body`)[2];

//task counter that updates with new tasks
let taskCount = JSON.parse(localStorage.getItem(`task-count`));
if(taskCount === null) {
  taskCount = 0;
}

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
if(taskList === null) {
  taskList = [];
}
let nextId = JSON.parse(localStorage.getItem("nextId"));
if(nextId === null) {
  nextId = [];
}

// get current date
let today = dayjs();

//saving task counter to local storage
function saveTaskCount(counter) {
  localStorage.setItem(`task-count`, JSON.stringify(counter))
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
  let taskId = `task` + taskCount;
  taskCount++;
  // console.log(taskCount);
  saveTaskCount(taskCount);
  return taskId;
}

//saving the task ids to local storage
function saveIds(taskIds) {
  localStorage.setItem(`nextId`, JSON.stringify(taskIds));
}

//saving tasklist to local storage
function saveTaskList(tasklist) {
  localStorage.setItem(`tasks`, JSON.stringify(tasklist));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const columns = [
    `to-do`,
    `in-progress`,
    `done`
  ];

  for(let i = 0; i < columns.length; i++) {
    let column = document.getElementById(columns[i]);
    // console.log(task.taskStatus);

    if(task.taskStatus === columns[i]) {
      //get to the cards div
      let columnChild = column.children[1].children;

      let cardEl = $(`<div>`);
      cardEl.addClass(`card task-card p-3`);
      cardEl.appendTo(columnChild);
      // cardEl.id = task.id;
      let cardId = task.id;
      cardEl.attr(`id`, cardId);
      // console.log(task.id);
      
      let cardBodyEl = $(`<div>`);
      cardBodyEl.addClass(`task-body`);
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
  }
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

  //create cards
  for(task in taskList) {
    createTaskCard(taskList[task]);
  }

  //make cards draggable
  let taskCard = $(`.task-card`);

  taskCard.draggable({
    stack: cardBody,
    start: function(event, ui) {
    }
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  event.preventDefault();
  let currentTask = {
    taskTitle: taskTitleInputEl.val(),
    taskDueDate: dateInputEl.val(),
    taskDescript: taskDescriptInputEl.val(),
    id: generateTaskId(),
    taskStatus: `to-do`,
  };

  if(!currentTask.taskTitle || !currentTask.taskDueDate || !currentTask.taskDescript) {
    $(`#formModal`).modal(`hide`);
    return;
  } else {
    // push recently input task to tasklist array and store in local storage
    nextId.push(currentTask.id);
    saveIds(nextId);
    taskList.push(currentTask);
    saveTaskList(taskList);
    //hide form after submit
    $(`#formModal`).modal(`hide`);
    //reset inputs after submit
    $(`#formModal`).on('hidden.bs.modal', function () {
      taskFormEl.trigger(`reset`);
    })
    //create cards
    location.reload();
    renderTaskList();
  }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  console.log(event.target.parentNode.parentNode.id);
  //grab the id of the task card
  let taskId = event.target.parentNode.parentNode.id;

  for(let i = 0; i < taskList.length; i++) {
    if(taskList[i].id === taskId) {
      console.log(`task found`);
    }
  }

  //remove the button's parent - the card
  // $(this).parent().remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop() {
  // console.log($(this));
  // console.log(ui);
  cardBody.droppable({
    drop: function(event, ui) {
      let draggedEl = ui.draggable;
      // console.log(draggedEl[0].id);
      let draggedID = draggedEl[0].id;
      // let draggedParentID = draggedEl.parent().attr.id;
      // console.log(draggedEl.parent().attr(`id`));
      // console.log(draggedEl[0].parentNode);
      // console.log(`its dropped`);
      // console.log(this.childNodes);
      if(this.childNodes[1].id === `todo-cards`) {
        // // console.log(`its in to do`);
        // draggedEl[0].parentNode.removeChild(draggedEl);
        for(let i = 0; i < taskList.length; i++) {
          if(taskList[i].id === draggedID) {
            // console.log(`found task`);
            // console.log(taskList[i].id);
            taskList[i].taskStatus = `to-do`; 
            // console.log(taskList[i].taskStatus);
            saveTaskList(taskList);
          }
        }
        draggedEl.appendTo(this);
      } else if(this.childNodes[1].id === `in-progress-cards`) {
        // console.log(`its in progress`);
        // draggedEl[0].parentNode.removeChild(draggedEl);
        for(let i = 0; i < taskList.length; i++) {
          if(taskList[i].id === draggedID) {
            // console.log(`found task`);
            // console.log(taskList[i].id);
            taskList[i].taskStatus = `in-progress`; 
            // console.log(taskList[i].taskStatus);
            saveTaskList(taskList);
          }
        }
        draggedEl.appendTo(this);
      } else if(this.childNodes[1].id === `done-cards`) {
        // console.log(`its done`);
        // draggedEl[0].parentNode.removeChild(draggedEl);
        for(let i = 0; i < taskList.length; i++) {
          if(taskList[i].id === draggedID) {
            // console.log(`found task`);
            // console.log(taskList[i].id);
            taskList[i].taskStatus = `done`; 
            // console.log(taskList[i].taskStatus);
            saveTaskList(taskList);
          }
        }
        draggedEl.appendTo(this);
      } 
    },
    over: function(event, ui) {
      // console.log(`its working`);
      // console.log(this);
    }
  });
  // draggedEl.parentNode.removeChild(draggedEl);
  // event.target.childNodes[1].appendChild(draggedEl);
}

function dragOverEff() {
  console.log(cardBodyElOne.className);
  if(cardBodyElOne.className === `card-body bg-light`){
    console.log(`it works`);
  } else {
    console.log(`no work`);
  }
  console.log(cardBodyElOne.childNodes);
  console.log(cardBodyElOne.childNodes[1].id);

  console.log(cardBodyElTwo.childNodes);
  console.log(cardBodyElTwo.childNodes[1].id);

  console.log(cardBodyElThree.childNodes);
  console.log(cardBodyElThree.childNodes[1].id);

  cardBody.on(`dragenter`, function(event) {
    if(event.target.classList.contains(`card-body`)) {
      event.target.classList.add(`dragover`);
    }
  });
  
  cardBody.on(`dragleave`, function(event) {
    if(event.target.classList.contains(`card-body`)) {
      event.target.classList.remove(`dragover`);
    }
  });
}

function testF() {
  const columns = [
    `to-do`,
    `in-progress`,
    `done`
  ];

  for(let i = 0; i < taskList.length; i++) {
    for(let j = 0; j < columns.length; j++) {
      let column = document.getElementById(columns[j]);

      if(taskList[i].taskStatus === columns[j]) {
        console.log(`it matches!`);
      }
    }
  }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // changes the date input from text to a calendar
  dateInputEl.datepicker({
    changeMonth: true,
    changeYear: true
  });

  // console.log(taskList);
  // console.log(nextId);
  // testF();

  //render task list
  renderTaskList();

  // dragOverEff();


  // make lanes droppable
  handleDrop();

  // cardBodyElTwo.droppable({
  //   drop: handleDrop(event, inProgEl)
  // });

  // cardBodyElThree.droppable({
  //   drop: handleDrop(event, doneEl)
  // });

  //make delete button work
  $(`.delete-button`).on(`click`, handleDeleteTask);

  // event listener for the add task button
  taskFormEl.on(`submit`, handleAddTask);
});
