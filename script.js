const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCounter = document.getElementById('task-counter');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
let currentFilter = 'all';

renderTasks();
setupFilters();

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();

    if (!text) return;

    tasks.push({
        id: crypto.randomUUID(),
        text,
        completed: false
    });

    syncAndRender();
    todoInput.value = '';
    todoInput.focus();
});

function setupFilters() {
    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active-filter'));
            button.classList.add('active-filter');
            currentFilter = button.getAttribute('data-filter');
            renderTasks();
        });
    });
}

function renderTasks() {
    todoList.innerHTML = '';

    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter((task) => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter((task) => task.completed);
    }

    if (filteredTasks.length === 0) {
        const emptyState = document.createElement('li');
        emptyState.className = 'empty-state';
        emptyState.textContent = currentFilter === 'all'
            ? 'No tasks yet. Add one to get started.'
            : 'No tasks in this view yet.';
        todoList.appendChild(emptyState);
    } else {
        filteredTasks.forEach((task) => {
            const li = document.createElement('li');
            li.classList.add('todo-item');
            if (task.completed) li.classList.add('completed');

            const textSpan = document.createElement('span');
            textSpan.textContent = task.text;
            textSpan.setAttribute('role', 'button');
            textSpan.setAttribute('tabindex', '0');
            textSpan.addEventListener('click', () => toggleTask(task.id));
            textSpan.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleTask(task.id);
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            li.appendChild(textSpan);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
    }

    updateCounter();
}

function updateCounter() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    taskCounter.textContent = `${completedTasks} of ${totalTasks} tasks completed`;
}

function toggleTask(id) {
    tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
    syncAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    syncAndRender();
}

function syncAndRender() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
}
