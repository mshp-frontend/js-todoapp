let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentTodoId = null;

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
    const input = document.getElementById('newTodo');
    const text = input.value.trim();
    
    if (text) {
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            notes: ''
        };
        
        todos.push(todo);
        saveTodos();
        renderTodos();
        input.value = '';
    }
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

function openModal(id) {
    const modal = document.getElementById('modal');
    const todo = todos.find(t => t.id === id);
    if (todo) {
        currentTodoId = id;
        document.getElementById('modalNote').value = todo.notes;
        modal.style.display = 'block';
        document.addEventListener('keydown', handleEscKey);
    }
}

function saveModalNote() {
    if (currentTodoId) {
        const note = document.getElementById('modalNote').value;
        todos = todos.map(todo => {
            if (todo.id === currentTodoId) {
                return { ...todo, notes: note };
            }
            return todo;
        });
        saveTodos();
        renderTodos();
        closeModal();
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    currentTodoId = null;
    document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        todoElement.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onclick="event.stopPropagation(); toggleTodo(${todo.id})">
            <div class="todo-content" onclick="openModal(${todo.id})">
                <div class="todo-text">${todo.text}</div>
                <div class="todo-notes">${todo.notes}</div>
            </div>
            <button class="delete-btn" onclick="event.stopPropagation(); deleteTodo(${todo.id})">Удалить</button>
        `;
        
        todoList.appendChild(todoElement);
    });
}

document.getElementById('newTodo').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

document.querySelector('.close').addEventListener('click', closeModal);

window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
});

renderTodos();
