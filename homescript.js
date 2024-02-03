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

panels.forEach(panel => { // Adiciona os listeners de drag and drop a um painel
  panel.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(panel, e.clientY)
    const task = document.querySelector('.dragging')
    const panelID = document.getElementById(panel.id) // Guarda o ID do painel onde a tarefa vai ser colocada
    if (afterElement == null) {
      panel.appendChild(task)
      task.status = panel.id;
      for (var i = 0; i < tasks.length; i++) { // Percorre o array de tarefas e altera o status da tarefa para o painel onde foi colocada
        if (tasks[i].id == task.id) {
          tasks[i].status = panelID; // Atualiza o status da tarefa
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
      saveTasks(); // Guarda as alterações na local storage
    }
  })
})

// Definir os botões de priority
const lowButton = document.getElementById("low-button-home");
const mediumButton = document.getElementById("medium-button-home");
const highButton = document.getElementById("high-button-home");
let taskPriority;


function setPriorityButtonSelected(button, priority) {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach(btn => btn.classList.remove("selected"));
  button.classList.add("selected");
  taskPriority = priority;
}
function removeSelectedPriorityButton() {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach(btn => btn.classList.remove("selected"));
}



// Event listeners para os botões priority
lowButton.addEventListener("click", () => setPriorityButtonSelected(lowButton, "low"));
mediumButton.addEventListener("click", () => setPriorityButtonSelected(mediumButton, "medium"));
highButton.addEventListener("click", () => setPriorityButtonSelected(highButton, "high"));

function getDragAfterElement(panel, y) {
    const draggableElements = [...panel.querySelectorAll('.task:not(.dragging)')] // Dentro da lista de painéis, seleciona todos os elementos com a classe task que nao tenham a classe dragging  
    return draggableElements.reduce((closest, child) => { // Retorna o elemento mais próximo do que esáa a ser arrastado e que está a ser comparado
        const box = child.getBoundingClientRect() // Retorna o tamanho do elemento e a sua posição relativamente ao viewport
        const offset = y - box.top - box.height / 2 // Calcula a distância entre o elemento que está a ser arrastado e o que está a ser comparado
        if (offset < 0 && offset > closest.offset) { // Se a distância for menor que 0 e maior que a distância do elemento mais próximo até agora
            return { offset: offset, element: child }
        } else { //
            return closest // Retorna o elemento mais próximo até agora
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element} 

  // Event listener do botão add task para criar uma nova task e colocá-la no painel To Do (default para qualquer task criada)
document.getElementById('addTask').addEventListener('click', function() {
  var Description = taskDescription.value.trim();
  var Name = taskName.value.trim();
  var priority = taskPriority;
  if (Name === '' || Description === '' || priority === null) {
    document.getElementById('warningMessage2').innerText = 'Fill in all fields and define a priority';
  } else {
    document.getElementById('warningMessage2').innerText = '';
  }
  if (Name.trim() !== '' && Description.trim() !== '' && priority !== null){
      const task = createTask(Name, Description, priority);
      const taskElement =createTaskElement(task);
     document.getElementById('todo').appendChild(taskElement);

      // Adicionar os listeners drag and drop à task criada de forma dinâmica
      attachDragAndDropListeners(taskElement);

      // Limpar os input fields depois de adicionar a task
      document.getElementById('taskName').value = '';
      document.getElementById('taskDescription').value = '';
      removeSelectedPriorityButton();
      taskPriority = null;

  }
  saveTasks();
});

function createTask(name, description, priority) { // Cria uma tarefa com o nome, a descrição e a priority passados como argumentos 
  const task = {
  title :name,
  description: description,
  identificacao: 'task-' + Date.now(),
  status: 'todo',
  priority: priority
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
    const descriprioncontainer = document.createElement('div');
    descriprioncontainer.className = 'post-it-text';
    const displayDescription = document.createElement('p');
    displayDescription.textContent = task.description;

    const deleteButton = document.createElement('img');
    deleteButton.src = 'multimedia/dark-cross-01.png';
    deleteButton.className = 'apagarButton';
    deleteButton.addEventListener('click', function () {
        const  deletemodal = document.getElementById('delete-modal');
         deletemodal.style.display = "grid"; 
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
    descriprioncontainer.appendChild(displayDescription);
    postIt.appendChild(taskTitle);
    postIt.appendChild(deleteButton);
    taskElement.appendChild(postIt);
    postIt.appendChild(descriprioncontainer);
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

// Guarda as tasks na local storage
function saveTasks() {
  const tasks = document.querySelectorAll('.task');
  const taskArrays = {
    todo: [],
    doing: [],
    done: []
  };
  
  tasks.forEach(task => {
    const taskData = {
      identificacao: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority
    };

    // Determina o status de cada task e coloca-a no array correspondente
    taskArrays[task.status].push(taskData);
  });

  // Combina todos os arrays de tasks num único array
  const tasksArray = [taskArrays.todo, taskArrays.doing, taskArrays.done];

  // Guarda o array global de tasks na local storage
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}
// Carrega as tarefas guardadas na local storage
function loadTasks() {
  const tasksArray = JSON.parse(localStorage.getItem('tasks'));

  if (tasksArray) { // Verifica se o tasksArray não é null
    // Define um array para guardar todos os arrays de tasks
    const allTasks = tasksArray.reduce((acc, curr) => acc.concat(curr), []);// Concatena todos os arrays de tarefas num único array
      // A função reduce() executa uma função reducer para cada elemento do array, o que resulta num único valor de retorno. A função reducer é alimentada por quatro parâmetros:
      // Acumulador (acc) (valor inicial igual ao primeiro valor do array, ou valor do parâmetro initialValue);
      // Valor Atual (cur) (o valor do elemento atual);
      // Index Atual (idx) (o índice atual do elemento que está a ser processado no array);
      // Array (src) (o array original para o qual a função reduce() foi chamada).
      // O valor retornado da função reducer é atribuída ao acumulador. O acumulador, com o seu valor atualizado, passa para cada iteração subsequente pelo array, que por fim, se tornará o valor resultante, único, final.
    allTasks.forEach(task => {
      const taskElement = createTaskElement(task);
      const panel = document.getElementById(task.status);
      panel.appendChild(taskElement);
      attachDragAndDropListeners(taskElement);
    });
  }
}

function deleteTask(id) {
  const tasksArray = JSON.parse(localStorage.getItem('tasks'));

  // Iteração sobre todos os arrays de tasks para encontrar e remover a task
  tasksArray.forEach(taskArray => {
    const index = taskArray.findIndex(task => task.identificacao === id); // Retorna o index da tarefa com o ID passado como argumento
    if (index !== -1) { // Se o index for diferente de -1
      taskArray.splice(index, 1); // Remove a tarefa do array
      const taskElement = document.getElementById(id); // Guarda o elemento da tarefa
      taskElement.remove(); // Remove o elemento da tarefa
    }
    saveTasks();
  });
}

window.onclose = function () { // Guarda as tarefas na local storage quando a página é fechada
  saveTasks();
}
 // Elemento html onde vai ser mostrada a hora
const displayTime = document.querySelector(".display-time");

function showTime() {
  let time = new Date();
  let timeString = time.toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' });
  displayTime.innerText = timeString;
  setTimeout(showTime, 1000);
}

showTime();

// Data
function updateDate() { // Mostra a data atual
  let today = new Date();

  let dayName = today.getDay(), // 0 - 6
    dayNum = today.getDate(), // 1 - 31
    month = today.getMonth(), // 0 - 11
    year = today.getFullYear(); // 2020

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // Valor -> ID do elemento html
  const IDCollection = ["day", "daynum", "month", "year"]; // Array com os IDs dos elementos html que vão mostrar a data
  // Retornar um array com números como índices
  const val = [dayWeek[dayName], dayNum, months[month], year]; // Array com os valores que vão ser mostrados nos elementos html
  for (let i = 0; i < IDCollection.length; i++) { // Percorre o array de IDs
    document.getElementById(IDCollection[i]).firstChild.nodeValue = val[i]; // Altera o valor do elemento html com o ID correspondente
  }
}

updateDate();