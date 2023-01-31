(() => {
  'use strict';

  const get = (target) => {
    return document.querySelector(target);
  };
  const getAll = (target) => {
    return document.querySelectorAll(target);
  };

  const API_URL = 'http://localhost:3000/todos';

  const $todos = get('.todos');
  const $todoForm = get('.todo-form');
  const $todoInput = get('.todo-input');
  const $pagination = get('.pagination');

  const limit = 5;
  let currentPage = 1;
  const totalCount = 53;
  const pageCount = 5;

  const pagination = () => {
    let totalPage = Math.ceil(totalCount / limit);
    let pageGroup = Math.ceil(currentPage / pageCount);
    let lastNumber = pageGroup * pageCount;
    if (lastNumber > totalPage) {
      lastNumber = totalPage;
    }
    let firstNumber = lastNumber - (pageCount - 1);

    const next = lastNumber + 1;
    const prev = firstNumber - 1;

    let html = '';

    if (prev > 0) {
      html += "<button class='prev' data-fn='prev'>이전</button> ";
    }

    for (let i = firstNumber; i <= lastNumber; i++) {
      html += `<button class="pageNumber" id="page_${i}">${i}</button>`;
    }
    if (lastNumber < totalPage) {
      html += `<button class='next' data-fn='next'>다음</button>`;
    }

    $pagination.innerHTML = html;
    const $currentPageNumber = get(`.pageNumber#page_${currentPage}`);
    $currentPageNumber.style.color = '#9dc0e8';

    const $currentPageNumbers = getAll(`.pagination button`);
    $currentPageNumbers.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.fn === 'prev') {
          currentPage = prev;
        } else if (button.dataset.fn === 'next') {
          currentPage = next;
        } else {
          currentPage = button.innerText;
        }
        pagination();
        getTodos();
      });
    });
  };

  const createTodoElement = (item) => {
    const { id, content, completed } = item;
    const $todoItem = document.createElement('div');
    const isChecked = completed ? 'checked' : '';
    $todoItem.classList.add('item');
    $todoItem.dataset.id = id;
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo-checkbox'
                ${isChecked}
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item-buttons content-buttons">
              <button class="todo-edit-button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo-remove-button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item-buttons edit-buttons">
              <button class="todo-edit-confirm-button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo-edit-cancel-button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `;
    return $todoItem;
  };

  const renderAllTodos = (todos) => {
    $todos.innerHTML = '';
    todos.forEach((item) => {
      const todoElement = createTodoElement(item);
      $todos.appendChild(todoElement);
    });
  };

  const getTodos = () => {
    fetch(`${API_URL}?_page=${currentPage}&_limit=${limit}`)
      .then((res) => res.json())
      .then((todos) => renderAllTodos(todos))
      .catch((err) => console.error(err));
  };

  const addTodo = (e) => {
    e.preventDefault();

    const todo = {
      content: $todoInput.value,
      completed: false,
    };

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    })
      .then(getTodos)
      .then(() => {
        $todoInput.value = '';
        $todoInput.focus();
      })
      .catch((err) => console.error(err));
  };

  const checkTodo = (e) => {
    if (e.target.className !== 'todo-checkbox') return;

    const $item = e.target.closest('.item');
    const id = $item.dataset.id;
    const completed = e.target.checked;

    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
  };

  const changeEditMode = (e) => {
    const $item = e.target.closest('.item');
    const $label = $item.querySelector('label');
    const $input = $item.querySelector('input[type = "text"]');
    const $contentButtons = $item.querySelector('.content-buttons');
    const $editButtons = $item.querySelector('.edit-buttons');
    const value = $input.value;

    if (e.target.className === 'todo-edit-button') {
      $label.style.display = 'none';
      $input.style.display = 'block';
      $contentButtons.style.display = 'none';
      $editButtons.style.display = 'block';
      $input.focus();
      $input.value = '';
      $input.value = value;
    }

    if (e.target.className === 'todo-edit-cancel-button') {
      $label.style.display = 'block';
      $input.style.display = 'none';
      $contentButtons.style.display = 'block';
      $editButtons.style.display = 'none';
      $input.value = $label.innerText;
    }
  };

  const editTodo = (e) => {
    if (e.target.className !== 'todo-edit-confirm-button') return;

    const $item = e.target.closest('.item');
    const id = $item.dataset.id;
    const $input = $item.querySelector('input[type = "text"]');
    const content = $input.value;

    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
      .then(getTodos)
      .catch((err) => console.error(err));
  };

  const removeTodo = (e) => {
    if (e.target.className !== 'todo-remove-button') return;

    const $item = e.target.closest('.item');
    const id = $item.dataset.id;

    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
      .then(getTodos)
      .catch((err) => console.error(err));
  };

  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getTodos();
      pagination();
    });

    $todoForm.addEventListener('submit', addTodo);
    $todos.addEventListener('click', checkTodo);
    $todos.addEventListener('click', changeEditMode);
    $todos.addEventListener('click', editTodo);
    $todos.addEventListener('click', removeTodo);
  };

  init();
})();
