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

    return draggableElements.reduce((closest, child) => {// retorna o elemento mais proximo do elemento que esta a ser arrastado e que esta a ser comparado
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
  status: 'panel1',
  priority: 'low'
  }
  return task;
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.id = task.identificacao;
    taskElement.priority = task.priority;
    taskElement.classList.add('task'); 
    if (task.priority === 'low') {
        taskElement.classList.add('low');
    } else if (task.priority === 'medium') {
        taskElement.classList.add('medium');
    } else if (task.priority === 'high') {
        taskElement.classList.add('high');
    }
    taskElement.draggable = true;
    taskElement.description = task.description;
    taskElement.title = task.title;
    taskElement.status = task.status;

    const postIt = document.createElement('div');
    postIt.className = 'post-it';

    const taskTitle = document.createElement('h3');
    taskTitle.textContent = task.title;

    const displayDescription = document.createElement('p');
    displayDescription.textContent = task.description;

    const deleteButton = document.createElement('img');
    deleteButton.src = 'multimedia/dark_cross.png';
    deleteButton.className = 'apagarButton';
    deleteButton.addEventListener('click', function () {
        const  deletemodal = document.getElementById('delete-modal');
        deletemodal.style.display = "block";
        const deletebtn = document.getElementById('delete-button');
        deletebtn.addEventListener('click', () => {
            deleteTask(taskElement.id);
            taskElement.remove();
            deletemodal.style.display = "none";
        });
        const cancelbtn = document.getElementById('cancel-delete-button');
        cancelbtn.addEventListener('click', () => {
            deletemodal.style.display = "none";
        });
    });

    postIt.appendChild(taskTitle);
    postIt.appendChild(deleteButton);
    taskElement.appendChild(postIt);
    taskElement.addEventListener('mouseover', function () {
      postIt.appendChild(displayDescription);
    });
    taskElement.addEventListener('mouseout', function () {
      postIt.removeChild(displayDescription);
    });
    taskElement.addEventListener('dblclick', function () {
        sessionStorage.setItem("taskDescription", taskElement.description);
        sessionStorage.setItem("taskTitle", taskElement.title);
        sessionStorage.setItem("taskid", taskElement.id);
        sessionStorage.setItem("taskStatus", taskElement.status);
        sessionStorage.setItem("taskPriority", taskElement.priority);
        window.location.href = 'task.html';
    });

    return taskElement;
}

function saveTasks() {
  const tasks = document.querySelectorAll('.task');
  const tasksArrayToDo = [];
  const tasksArrayDoing = [];
  const tasksArrayDone = [];
  
  tasks.forEach(task => {
    if (task.status === 'panel1') {
      tasksArrayToDo.push({
        identificacao: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority
      });
    } else if (task.status === 'panel2') {
      tasksArrayDoing.push({
        identificacao: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority
      });
    } else if (task.status === 'panel3') {
      tasksArrayDone.push({
        identificacao: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority
      });
    }
  });

  const tasksArray = [tasksArrayToDo, tasksArrayDoing, tasksArrayDone];
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

function loadTasks() { // carrega as tarefas guardadas no local storage
  const tasksArray = JSON.parse(localStorage.getItem('tasks'));
  const tasksArrayToDo = tasksArray[0];
  const tasksArrayDoing = tasksArray[1];
  const tasksArrayDone = tasksArray[2];
  tasksArrayToDo.forEach(task => { // percorre o array de tarefas
    const taskElement = createTaskElement(task);
    const panel = document.getElementById(task.status); // guarda o painel onde a tarefa vai ser colocada
    panel.appendChild(taskElement); // adiciona a tarefa ao painel
    attachDragAndDropListeners(taskElement); // adiciona os listeners de drag and drop a tarefa
  });
  tasksArrayDoing.forEach(task => {
    const taskElement = createTaskElement(task);
    const panel = document.getElementById(task.status);
    panel.appendChild(taskElement);
    attachDragAndDropListeners(taskElement);
  });
  tasksArrayDone.forEach(task => {
    const taskElement = createTaskElement(task);
    const panel = document.getElementById(task.status);
    panel.appendChild(taskElement);
    attachDragAndDropListeners(taskElement);
  });
}
function deleteTask(id) {
  var task = document.getElementById(id);
  task.remove();
const tasks = JSON.parse(localStorage.getItem('tasks'));
const tasksArrayToDo = tasks[0];
const tasksArrayDoing = tasks[1];
const tasksArrayDone = tasks[2];
if(tasksArrayToDo) {
  for (var i = 0; i < tasksArrayToDo.length; i++) { // percorre o array de tarefas
    if (tasksArrayToDo[i].identificacao == id) { // se a tarefa tiver o mesmo id que a tarefa passada como argumento
      removeItemFromArr(tasksArrayToDo, tasksArrayToDo[i]); // remove a tarefa do array de tarefas
    }
  }
}
if (tasksArrayDoing) {
  for (var i = 0; i < tasksArrayDoing.length; i++) {
    if (tasksArrayDoing[i].identificacao == id) {
      removeItemFromArr(tasksArrayDoing, tasksArrayDoing[i]);
    }
  }
}
if (tasksArrayDone) {
  for (var i = 0; i < tasksArrayDone.length; i++) {
    if (tasksArrayDone[i].identificacao == id) {
      removeItemFromArr(tasksArrayDone, tasksArrayDone[i]);
    }
  }
  saveTasks();
}
}
function removeItemFromArr(arr, item) {
  var i = arr.indexOf(item);
  arr.splice(i, 1);
}
window.onclose = function () { // guarda as tarefas no local storage quando a pagina e fechada
  saveTasks();
}