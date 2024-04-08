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

      //colouring card if based on date
      let dueDate = task.taskDueDate;
      let date = dayjs(dueDate)
      let dayDiff = date.diff(today, `day`);
      if(date.isBefore(today)) {
        cardEl.addClass(`overdue`);
      }
      
      //if date is within 5 days set to colour scheme to nearing
      if(date.isAfter(today)) {
        if(dayDiff < 5) {
          cardEl.addClass(`nearing`);
        }
      }
      
      //if date is past due date set colour scheme to overdue
      if(date.isSame(today)) {
        cardEl.addClass(`overdue`);
      }

      //colouring if placed into done column
      if(task.taskStatus === `done`) {
        cardEl.addClass(`task-done`);
      }
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
    stack: taskCard,
    snap: cardBody,
    snapMode: `inner`,
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
    //reload since rendertasklist creates a crad as well doubling the cards
    location.reload();
    renderTaskList();
  }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  let foundTaskIndex = null;
  let foundIdIndex = null;
  //grab the id of the task card
  let taskId = event.target.parentNode.parentNode.id;

  //locate the corresponding task and grab the index
  for(let i = 0; i < taskList.length; i++) {
    if(taskList[i].id === taskId) {
      foundTaskIndex = i;
      console.log(foundTaskIndex);
    }
  }

  //locate the corresponding id and grab the index
  for(let j = 0; j < nextId.length; j++) {
    if(nextId[j] === taskId) {
      foundIdIndex = j;
      console.log(foundIdIndex);
    }
  }

  //remove the button's parent - the card
  $(this).parent().remove();

  //remove the task from storage
  taskList.splice(foundTaskIndex, 1);
  saveTaskList(taskList);

  //remove the id from storage
  nextId.splice(foundIdIndex, 1);
  saveIds(nextId);
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop() {
  cardBody.droppable({
    drop: function(event, ui) {
      //grabs the dragged element
      let draggedEl = ui.draggable;
      //grabs the dragged elements id
      let draggedID = draggedEl[0].id;

      //if dropped in column
      if(this.childNodes[1].id === `todo-cards`) {
        // draggedEl[0].parentNode.removeChild(draggedEl);
        //find the dragged elements corresponding task object in taskList and change its status to the dropped cloumn
        for(let i = 0; i < taskList.length; i++) {
          if(taskList[i].id === draggedID) {
            taskList[i].taskStatus = `to-do`; 
            saveTaskList(taskList);
          }
        }
        //append dragged element to the column
        draggedEl.appendTo(this);
      } else if(this.childNodes[1].id === `in-progress-cards`) {
        // draggedEl[0].parentNode.removeChild(draggedEl);
        for(let i = 0; i < taskList.length; i++) {
          if(taskList[i].id === draggedID) {
            taskList[i].taskStatus = `in-progress`; 
            saveTaskList(taskList);
          }
        }
        draggedEl.appendTo(this);
      } else if(this.childNodes[1].id === `done-cards`) {
        // draggedEl[0].parentNode.removeChild(draggedEl);
        for(let i = 0; i < taskList.length; i++) {
          if(taskList[i].id === draggedID) {
            taskList[i].taskStatus = `done`; 
            saveTaskList(taskList);
          }
        }
        draggedEl.appendTo(this);
        // console.log(this.className);
        // this.addClass(`task-done`);
      } 
    },
    over: function(event, ui) {
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
