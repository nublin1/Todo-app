localStorage = window.localStorage;


(function () {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoitemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = "Введите название нового дела";
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.setAttribute('disabled', true);

        input.addEventListener('input', function (e) {
            e.preventDefault();
            //console.log(input.value.length > 0);
            if (input.value.length > 0) {
                button.removeAttribute('disabled');
            } else {
                button.setAttribute('disabled', true);
            }
        })


        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');

        let items = [];

        return {
            list,
            items
        };
    }

    function getRandomId() {
        return Math.floor(Math.random() * 1000);
    }

    function saveToDoListInStorage(key, todoList) {
        localStorage.setItem(key, JSON.stringify(todoList));
    }

    function createTodoItem(name, done = false) {
        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        if (done) {
            item.classList.toggle('list-group-item-success');
        }

        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function createToDoApp(container, title = 'список дел', key) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoitemForm();
        let todoList = createTodoList();

        if (localStorage.getItem(key) !== null && localStorage.getItem(key).length > 0) {
            todoList.items = JSON.parse(localStorage.getItem(key));
        }

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList.list);

        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            let todoItem = createTodoItem(todoItemForm.input.value, false);
            todoItem.Id = getRandomId();

            let obj = {
                name: todoItem.item.firstChild.data,
                done: todoItem.item.classList.contains('list-group-item-success'),
                Id: todoItem.Id
            }
            todoList.items.push(obj);
            saveToDoListInStorage(key, todoList.items);
            todoList.list.append(todoItem.item);

            todoItem.doneButton.addEventListener('click', function () {
                todoItem.item.classList.toggle('list-group-item-success');
                const result = todoList.items.find(obj => obj.name === todoItem.item.firstChild.data);
                result.done = !result.done;
                saveToDoListInStorage(key, todoList.items);
            });
            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Вы действительно хотите удалить это дело?'))
                    todoItem.item.remove();
                todoList.items.splice(todoList.items.indexOf(todoItem), 1);
                saveToDoListInStorage(key, todoList.items);
            });

            todoItemForm.input.value = '';
            todoItemForm.button.setAttribute('disabled', true);
        });

        todoList.items.forEach(element => {
            //console.log(element);
            let todoItem = createTodoItem(element.name, element.done);
            todoItem.doneButton.addEventListener('click', function () {
                todoItem.item.classList.toggle('list-group-item-success');
                todoList.items[todoList.items.indexOf(element)].done = !element.done;
                saveToDoListInStorage(key, todoList.items);
            });
            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Вы действительно хотите удалить это дело?'))
                    todoItem.item.remove();
                todoList.items.splice(todoList.items.indexOf(element), 1);
                saveToDoListInStorage(key, todoList.items);
            });
            todoList.list.append(todoItem.item);
        })

    }

    window.createToDoApp = createToDoApp;
})();