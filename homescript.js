window.onload = function () {
    var username = sessionStorage.getItem("login");
    if (username) {
      document.getElementById("login").textContent = username;
    }
  };
const tasks = document.querySelectorAll('.task')
const panels = document.querySelectorAll('.panel')

function attachDragAndDropListeners(task) {
  task.addEventListener('dragstart', () => {
      task.classList.add('dragging')
  });

  task.addEventListener('dragend', () => {
      task.classList.remove('dragging')
  });
}
tasks.forEach(task => {
  task.addEventListener('dragstart', () => {
    task.classList.add('dragging')
  })

  task.addEventListener('dragend', () => {
    task.classList.remove('dragging')
  })
}) 
panels.forEach(panel => {
  panel.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(panel, e.clientY)
    const task = document.querySelector('.dragging')
    if (afterElement == null) {
      panel.appendChild(task)
    } else {
      panel.insertBefore(task, afterElement)
    }
  })
})
function getDragAfterElement(panel, y) {
    const draggableElements = [...panel.querySelectorAll('.task:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element}

document.getElementById('addTask').addEventListener('click', function() {
  var Description = taskDescription.value.trim();
  var Name = taskName.value.trim();
  if (Name.trim() !== '' && Description.trim() !== ''){
      const task = createTaskElement(Name, Description);
     document.getElementById('panel1').appendChild(task);

      // Attach drag and drop listeners to the dynamically created task
      attachDragAndDropListeners(task);

      // Clear input fields after adding task
      document.getElementById('taskName').value = '';
      document.getElementById('taskDescription').value = '';
  }
});

function createTaskElement(name, description) {
  const taskElement = document.createElement('div');
  taskElement.className = 'task';
  taskElement.draggable = true;

  const postIt = document.createElement('div');
  postIt.className = 'post-it';

  const taskTitle = document.createElement('h3');
  taskTitle.textContent = name;

  const deleteButton = document.createElement('img');
  deleteButton.src = 'red_cross.png';
  deleteButton.className = 'apagarButton';
  deleteButton.addEventListener('click', function () {
      taskElement.remove();
  });

  postIt.appendChild(taskTitle);
  postIt.appendChild(deleteButton);
  taskElement.appendChild(postIt);

  return taskElement;
}