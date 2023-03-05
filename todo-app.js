(function () {
  // Создаем массив с делами
  let todoListsMas = [];

  // создаем и возвращаем заголовок приложения 
  function createAppTitle(title) {
      let appTitle = document.createElement('h2');
      appTitle.innerHTML = title;
      return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');
  
    form.classList.add('input-group' , 'md-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn' , 'btn-primary');
    button.textContent = 'Добавить дело';
  
    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);
  
    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  
  // создаем и добавляем дело в список
  let todoItemDone = false;
  function createTodoItem(todoName) {
    let idTodoItem = Date.now();
    let todo = {
      id: idTodoItem,
      name: todoName,
      done: todoItemDone
    };


    let item = document.createElement('li');
    
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');
  
    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item' , 'd-flex' , 'justify-content-between' , 'align-items-center');
    item.textContent = todoName;

    buttonGroup.classList.add('btn-group' , 'btn-group-sm');
    doneButton.classList.add('btn' , 'btn-success')
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn' , 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // вкладываем кнопки в отдельный элемент, что бы они обьеденились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);
    // добавляем дело в массив
    todoListsMas.push(todo);
    
    // приложению нужен доступ самому элементу и кнопкам, что бы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
      todo,
    };
  }

  function createTodoApp(container , title = 'Список дел', listName) { 



    //Создаем переменную выгрузки массива из LocalStorage
    let loadListTodo = JSON.parse(localStorage.getItem(listName));
    console.log(loadListTodo);
    // Создаем функцию записи массива на localStorage
    function saveListTodo() {
      localStorage.setItem(listName, JSON.stringify(todoListsMas));
    }

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    //отключаем кнопку пока не начали вводить текст в Input 
    todoItemForm.button.disabled = true;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
    
    if (loadListTodo) {
      loadListTodo.forEach(function(item) {
      let todoItem = createTodoItem(item.name);
      todoItem.item.dataset.id = item.id;
      todoItem.todo.done = item.done;
      if (item.done) {
        todoItem.item.classList.add('list-group-item-success');
      }
      todoItem.doneButton.addEventListener('click', function() {
        todoItem.item.classList.toggle('list-group-item-success');
        todoItem.todo.done = !todoItem.todo.done;
        saveListTodo();
      });
      todoItem.deleteButton.addEventListener('click', function() {
      if (confirm('Вы уверены?')) {
        todoItem.item.remove();
        // Удаляем дело из массива
        const idToDelete = todoItem.todo.id;
        const indexToDelete = todoListsMas.findIndex(todo => todo.id === idToDelete);
        if (indexToDelete !== -1) {
          todoListsMas.splice(indexToDelete, 1);
          saveListTodo();
        }
      }
    });
    todoList.append(todoItem.item);
  });
}

    // если значение элемента ввода не является пустой строкой, включаем кнопку
    todoItemForm.input.addEventListener('input' , function(){
      if (todoItemForm.input.value.trim() !== '') {
        todoItemForm.button.disabled = false;
      }
    });

    //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit' , function(e) {
      // эта строчка нужна, что бы предотвратить стандартное действие браузера
      // в данном случае мы не хотим, что бы страница перезагружалась при отправке формы
      e.preventDefault();
      saveListTodo();
      

      let todoItem = createTodoItem(todoItemForm.input.value);

      //отключаем кнопку в форме после создания дела ведь строка Input опять пуста 
      todoItemForm.button.disabled = true;

      // добовляем обработчики на кнопки 
      todoItem.doneButton.addEventListener('click' , function() {
        todoItem.item.classList.toggle('list-group-item-success');

        // изменяем статус Done при нажатии на кнопку doneButton
        const idToUpdate = todoItem.todo.id;
        const indexToUpdate = todoListsMas.findIndex(todo => todo.id === idToUpdate);
        if (indexToUpdate !== -1) {
          todoListsMas[indexToUpdate].done = !todoListsMas[indexToUpdate].done;
          saveListTodo();
        }
      });
      // добовляем обработчики на кнопки 
      todoItem.deleteButton.addEventListener('click' , function() {
        if (confirm('Вы уверены?')) {
          todoItem.item.remove();
          // Удаляем дело из массива
          const idToDelete = todoItem.todo.id;
          const indexToDelete = todoListsMas.findIndex(todo => todo.id === idToDelete);
          if (indexToDelete !== -1) {
            todoListsMas.splice(indexToDelete, 1);
            saveListTodo();
          }
        }
      });
      // создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);
      saveListTodo();

      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';
    });
  }
  window.createTodoApp = createTodoApp;
})();  