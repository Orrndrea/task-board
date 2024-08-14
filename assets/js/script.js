// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Save tasks and nextId to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Update task color based on deadline
function updateTaskColor(card, deadline, status) {
  const now = dayjs().startOf('day');
  const dueDate = dayjs(deadline).startOf('day');

  card.removeClass('bg-danger bg-warning bg-white text-white');

  if (status === 'done') {
    card.addClass('bg-white');
  } else if (dueDate.isBefore(now)) {
    card.addClass('bg-danger text-white'); // Past due
  } else if (dueDate.isSame(now, 'day')) {
    card.addClass('bg-warning'); // Due today
  } else {
    card.addClass('bg-white'); // Due in the future
  }
}

// Create a task card
function createTaskCard(task) {
  const card = $(`
    <div class="card mb-3 task-card" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text"><small class="text-muted">${task.deadline}</small></p>
        <button class="btn btn-danger btn-sm delete-task">Delete</button>
      </div>
    </div>
  `);

  updateTaskColor(card, task.deadline, task.status);

  return card;
}

// Render the task list
function renderTaskList() {
  $('#todo-cards, #in-progress-cards, #done-cards').empty();

  taskList.forEach(task => {
    const card = createTaskCard(task);
    $(`#${task.status}-cards`).append(card);
  });

  $('.task-card').draggable({
    revert: "invalid",
    start: function() {
      $(this).css('z-index', 1000);
    },
    stop: function() {
      $(this).css('z-index', '');
    }
  });

  $('.delete-task').on('click', handleDeleteTask);
}

// Handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const title = $('#task-title').val().trim();
  const description = $('#task-desc').val().trim();
  const deadline = $('#task-deadline').val().trim();

  if (title && deadline) {
    const task = {
      id: generateTaskId(),
      title,
      description,
      deadline,
      status: 'todo'
    };

    taskList.push(task);
    saveTasks();
    renderTaskList();

    $('#formModal').modal('hide');
    $('#task-form')[0].reset();
  }
}

// Handle deleting a task
function handleDeleteTask() {
  const taskId = $(this).closest('.task-card').data('id');
  taskList = taskList.filter(task => task.id !== taskId);
  saveTasks();
  renderTaskList();
}

// Handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.data('id');
  const newStatus = $(this).closest('.lane').attr('id');

  const task = taskList.find(task => task.id === taskId);
  task.status = newStatus;
  saveTasks();
  renderTaskList();
}

// When the page loads
$(document).ready(function() {
  renderTaskList();

  $('.lane .card-body').droppable({
    accept: '.task-card',
    drop: handleDrop
  });

  $('#task-form').on('submit', handleAddTask);
});
