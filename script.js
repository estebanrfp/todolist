document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');
    const tasksCount = document.getElementById('tasks-count');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterButtons = document.querySelectorAll('.filter');
    
    // Estado de la aplicación
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Función para guardar tareas en localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    
    // Función para actualizar el contador de tareas
    const updateTasksCount = () => {
        const pendingTasks = tasks.filter(task => !task.completed).length;
        tasksCount.textContent = `${pendingTasks} ${pendingTasks === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;
    };
    
    // Función para crear un elemento de tarea
    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        const checkIcon = document.createElement('i');
        checkIcon.className = `task-check fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}`;
        checkIcon.addEventListener('click', () => toggleTaskStatus(task.id));
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-task';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        li.appendChild(checkIcon);
        li.appendChild(taskText);
        li.appendChild(deleteBtn);
        
        return li;
    };
    
    // Función para renderizar las tareas
    const renderTasks = () => {
        // Limpiar la lista primero
        taskList.innerHTML = '';
        
        // Filtrar tareas según el filtro actual
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        // Crear y añadir elementos de tarea
        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
        
        // Actualizar contador
        updateTasksCount();
    };
    
    // Función para añadir una nueva tarea
    const addTask = () => {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now().toString(),
                text: text,
                completed: false
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            
            // Limpiar el input
            taskInput.value = '';
            taskInput.focus();
        }
    };
    
    // Función para cambiar el estado de una tarea
    const toggleTaskStatus = (id) => {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return {...task, completed: !task.completed};
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
    };
    
    // Función para eliminar una tarea
    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };
    
    // Función para limpiar tareas completadas
    const clearCompletedTasks = () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    };
    
    // Función para cambiar el filtro activo
    const changeFilter = (filter) => {
        currentFilter = filter;
        
        // Actualizar clases de los botones de filtro
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        renderTasks();
    };
    
    // Event listeners
    addButton.addEventListener('click', addTask);
    
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            changeFilter(btn.dataset.filter);
        });
    });
    
    // Inicializar la aplicación
    renderTasks();
});