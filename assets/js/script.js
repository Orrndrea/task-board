let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;


function generateTaskId() {
    nextId = nextId + 1;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}

function createTaskCard(task) {
    let taskCard = `<div class="task-card" id="task-${task.id}">
        <div class="task-title">${task.title}</div>
        <div class="task-description">${task.description}</div>
        <div class="task-due-date">${task.dueDate}</div>
        <button class="delete-task-btn">Delete</button>
    </div>`;
    return taskCard;
}

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

function handleDeleteTask(event) {
    let taskId = $(event.target).closest(".task-card").attr("id");
    taskList = taskList.filter(task => `task-${task.id}` !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

function handleDrop(event, ui) {
    let taskId = ui.draggable.attr("id");
    let newStatus = $(event.target).attr("id").replace('-cards', '');
    let task = taskList.find(task => `task-${task.id}` === taskId);
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

$(document).ready(function () {
    renderTaskList();

     $("#addTaskButton").on("click", handleAddTask);

    $("#taskList").on("click", ".delete-task-btn", handleDeleteTask);

    $(".status-lane").droppable({
        drop: handleDrop
    });

   
    $("#dueDate").datepicker();
});

