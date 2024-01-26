window.onload = function () {
    var username = sessionStorage.getItem("login");
    if (username) {
      document.getElementById("login").textContent = username;
    }
  };
const tasks = document.querySelectorAll('.task')
const panels = document.querySelectorAll('.panel')

function attachDragAndDropListeners(task) { // Adiciona os listeners de drag and drop a uma tarefa criada dinamicamente
  task.addEventListener('dragstart', () => {
      task.classList.add('dragging')
  });

  task.addEventListener('dragend', () => {
      task.classList.remove('dragging')
  });
}
// codigo para o drag and drop das tasks hardcoded. vai sair pro projecto final
tasks.forEach(task => {
  task.addEventListener('dragstart', () => {
    task.classList.add('dragging');
  });

  task.addEventListener('dragend', () => {
    task.classList.remove('dragging');
  });

  const deleteButton = task.querySelector('.apagarButton');
  deleteButton.addEventListener('click', function () {
    task.remove();
  });
});



panels.forEach(panel => { // Adiciona os listeners de drag and drop a um painel
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
    const draggableElements = [...panel.querySelectorAll('.task:not(.dragging)')] // dentro da lista de paineis, seleciona todos os elementos com a classe task que nao tenham a classe dragging  

    return draggableElements.reduce((closest, child) => {// retorna o elemento mais proximo do elemento que esta a ser arrastado e
        const box = child.getBoundingClientRect() // retorna o tamanho do elemento e a sua posicao relativa ao viewport
        const offset = y - box.top - box.height / 2// calcula a distancia entre o elemento que esta a ser arrastado e o elemento que esta a ser comparado
        if (offset < 0 && offset > closest.offset) {// se a distancia for menor que 0 e maior que a distancia do elemento mais proximo ate agora
            return { offset: offset, element: child }
        } else { //
            return closest // retorna o elemento mais proximo ate agora
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
  const taskId = 'task-' + Date.now(); // Gera Id especifico da tarefa.
  taskElement.id = taskId; // Define o Id da tarefa.
  taskElement.className = 'task';
  taskElement.draggable = true;
  taskElement.description = description; // Guarda a descrição da tarefa no elemento.
  taskElement.title = name; // Guarda o nome da tarefa no elemento.

  const postIt = document.createElement('div');
  postIt.className = 'post-it';

  const taskTitle = document.createElement('h3');
  taskTitle.textContent = name;

  const deleteButton = document.createElement('img');
  deleteButton.src = 'multimedia/red_cross.png';
  deleteButton.className = 'apagarButton';
  deleteButton.addEventListener('click', function () {
    taskElement.remove();
  });

  postIt.appendChild(taskTitle);
  postIt.appendChild(deleteButton);
  taskElement.appendChild(postIt);

  return taskElement;
}
