// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
    nextId = nextId + 1;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}

// Function to create a task card
function createTaskCard(task) {
    let taskCard = `<div class="task-card" id="task-${task.id}">
        <div class="task-title">${task.title}</div>
        <div class="task-description">${task.description}</div>
        <div class="task-due-date">${task.dueDate}</div>
        <button class="delete-task-btn">Delete</button>
    </div>`;
    return taskCard;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    $("#taskList").empty();
    taskList.forEach(task => {
        let taskCard = createTaskCard(task);
        $(`#${task.status}-cards`).append(taskCard);
    });
    $(".task-card").draggable({
        revert: 'invalid'
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    let title = $("#taskTitle").val();
    let description = $("#taskDescription").val();
    let dueDate = $("#dueDate").val();
    let newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
        status: 'todo'
    };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Function to handle deleting a task
function handleDeleteTask(event) {
    let taskId = $(event.target).closest(".task-card").attr("id");
    taskList = taskList.filter(task => `task-${task.id}` !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = ui.draggable.attr("id");
    let newStatus = $(event.target).attr("id").replace('-cards', '');
    let task = taskList.find(task => `task-${task.id}` === taskId);
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    // Add event listener for adding a task
    $("#addTaskButton").on("click", handleAddTask);

    // Add event listener for deleting a task
    $("#taskList").on("click", ".delete-task-btn", handleDeleteTask);

    // Make lanes droppable
    $(".status-lane").droppable({
        drop: handleDrop
    });

    // Initialize date picker
    $("#dueDate").datepicker();
});
