// 1. DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCounter = document.getElementById('task-counter');
const filterButtons = document.querySelectorAll('.filter-btn'); // Select all 3 filter buttons

// 2. App State
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
let currentFilter = 'all'; // Tracking current selected tab view ('all', 'active', 'completed')

// 3. Initial Setup
renderTasks();
setupFilters();

// 4. Handle Form Submit
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    
    if (text) {
        const newTask = {
            id: crypto.randomUUID(),
            text: text,
            completed: false
        };
        
        tasks.push(newTask);
        syncAndRender();
        todoInput.value = '';
    }
});

// 5. Setup Filter Button Click Listeners
function setupFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove highlighting class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active-filter'));
            
            // Add highlighting class to clicked button
            button.classList.add('active-filter');
            
            // Set state variable to selected filter criteria
            currentFilter = button.getAttribute('data-filter');
            
            // Re-render display using new filter bounds
            renderTasks();
        });
    });
}

// 6. Render Tasks to the UI
function renderTasks() {
    todoList.innerHTML = ''; 

    // Create a temporary filtered copy of our tasks array
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Loop through the filtered array instead of full array
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        if (task.completed) li.classList.add('completed');

        const textSpan = document.createElement('span');
        textSpan.textContent = task.text;
        textSpan.style.cursor = 'pointer';
        textSpan.style.textDecoration = task.completed ? 'line-through' : 'none';
        textSpan.style.color = task.completed ? '#888' : '#333';
        textSpan.addEventListener('click', () => toggleTask(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });

    updateCounter();
}

// 7. Live Counter Calculation Function
function updateCounter() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    taskCounter.textContent = `${completedTasks} of ${totalTasks} tasks completed`;
}

// 8. State Management Functions
function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    syncAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    syncAndRender();
}

// 9. Save to Browser Memory and Refresh View
function syncAndRender() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
}
