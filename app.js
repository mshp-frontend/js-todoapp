let todos = ['Сделать что-то хорошее'];
let checked = [false];

let externalTodos = localStorage.getItem('todos');
let externalChecked = localStorage.getItem('checked');

if (externalTodos !== null) {
    todos = JSON.parse(externalTodos);
    checked = JSON.parse(externalChecked);
}

function renderTodos() {
    const todoList = document.getElementById('todos');
    todoList.innerHTML = '';

    for (let i = 0; i < todos.length; i++) {
        let todoText = todos[i];
        let todoCompleted = checked[i];

        const todoElement = document.createElement('li');
        todoElement.className = 'todo';

        todoElement.innerHTML = `
            <input type="checkbox"${todoCompleted ? ' checked' : ' '}
                   onclick="event.stopPropagation();completeTodo(${i})">
            <p>${todoText}</p>
            <button onclick="event.stopPropagation();deleteTodo(${i})">&times;</button>
        `;

        todoList.appendChild(todoElement);
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('checked', JSON.stringify(checked));
}

const newTodo = document.getElementById('addTodo');
newTodo.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopPropagation();

    const input = document.getElementById('newTodo');
    const existingText = document.querySelector('p.existing');
    const text = input.value.trim();
    const submitButton = event.submitter;

    if (text !== '') {
        const todoExists = todos.indexOf(text) !== -1;

        if (todoExists && submitButton) {
            existingText.classList.add('appear');
            submitButton.setAttribute('disabled', 'disabled');

            setTimeout(function () {
                existingText.classList.remove('appear');
                submitButton.removeAttribute('disabled');
            }, 800);

            return;
        }

        todos.push(text);
        checked.push(false);

        saveTodos();
        renderTodos();
        input.value = '';
    }
});

function deleteTodo(index) {
    const updatedTodos = [];
    const updatedChecked = [];

    for (let i = 0; i < todos.length; i++) {
        if (index !== i) {
            updatedTodos.push(todos[i]);
            updatedChecked.push(checked[i]);
        }
    }

    todos = updatedTodos;
    checked = updatedChecked;

    saveTodos();
    renderTodos();
}

function completeTodo(index) {
    checked[index] = !checked[index];
    saveTodos();
}

renderTodos();
