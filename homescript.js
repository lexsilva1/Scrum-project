window.onload = function () {
    var username = sessionStorage.getItem("login");
    if (username) {
      document.getElementById("login").textContent = username;
    }
    loadTasks();
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
    const panelID = document.getElementById(panel.id) // guarda o id do painel onde a tarefa vai ser colocada
    if (afterElement == null) {
      panel.appendChild(task)
      task.status = panel.id;
      for (var i = 0; i < tasks.length; i++) { // percorre o array de tarefas e altera o status da tarefa para o painel onde foi colocada
        if (tasks[i].id == task.id) {
          tasks[i].status = panelID; // actualiza o status da tarefa
        }
      }
      saveTasks();
    } else {
      panel.insertBefore(task, afterElement)
      task.status = panel.id;
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == task.id) {
          tasks[i].status = panelID;
        }
      }
      saveTasks(); // guarda as alteracoes no local storage
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
      const task = createTask(Name, Description);
      const taskElement =createTaskElement(task);
     document.getElementById('panel1').appendChild(taskElement);

      // Attach drag and drop listeners to the dynamically created task
      attachDragAndDropListeners(taskElement);

      // Clear input fields after adding task
      document.getElementById('taskName').value = '';
      document.getElementById('taskDescription').value = '';
  }
  saveTasks();
});

function createTask(name, description) {  // Cria uma tarefa com o nome e descrição passados como argumento 
  const task = {
  title :name,
  description: description,
  identificacao: 'task-' + Date.now(),
  status: 'panel1'
  }
  return task;
}

function createTaskElement(task) { // Cria um elemento tarefa com a informação passada como argumento
  const taskElement = document.createElement('div');
  taskElement.id = task.identificacao; // Define o Id da tarefa.
  taskElement.className = 'task';
  taskElement.draggable = true;
  taskElement.description = task.description; // Guarda a descrição da tarefa no elemento.
  taskElement.title = task.title;
  taskElement.status = task.status;
  const postIt = document.createElement('div');
  postIt.className = 'post-it';

  const taskTitle = document.createElement('h3');
  taskTitle.textContent = task.title;

  const deleteButton = document.createElement('img');
  deleteButton.src = 'multimedia/green_cross.png';
  deleteButton.className = 'apagarButton';
  deleteButton.addEventListener('click', function () {
    deleteTask(taskElement.id);
    taskElement.remove();
  });

  postIt.appendChild(taskTitle);
  postIt.appendChild(deleteButton);
  taskElement.appendChild(postIt);

  return taskElement;
}
function saveTasks() {
  const tasks = document.querySelectorAll('.task'); // lista de tarefas
  const tasksArray = []; // array que vai guardar a informacao de cada tarefa
  tasks.forEach(task => { // percorre a lista de tarefas e guarda a informacao de cada tarefa num array
      tasksArray.push({ // guarda a informacao de cada tarefa num objecto
          identificacao: task.id,
          title: task.title,
          description: task.description,
          status: task.status
      });
  });
  localStorage.setItem('tasks', JSON.stringify(tasksArray)); // guarda o array de tarefas no local storage
}
function loadTasks() { // carrega as tarefas guardadas no local storage
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    const panel = document.getElementById(task.status); // guarda o painel onde a tarefa vai ser colocada
    panel.appendChild(taskElement); // adiciona a tarefa ao painel
    attachDragAndDropListeners(taskElement); // adiciona os listeners de drag and drop a tarefa
  });
}
function deleteTask(id) {
  var task = document.getElementById(id);
  task.remove();
const tasks = JSON.parse(localStorage.getItem('tasks'));
for (var i = 0; i < tasks.length; i++) { // percorre o array de tarefas
  if (tasks[i].id == id) { // se a tarefa tiver o mesmo id que a tarefa passada como argumento
    removeItemFromArr(tasks, tasks[i]); // remove a tarefa do array de tarefas
  }
  saveTasks();
}
}
window.onclose = function () { // guarda as tarefas no local storage quando a pagina e fechada
  saveTasks();
}


