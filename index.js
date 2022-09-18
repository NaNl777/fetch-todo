const URL = "https://jsonplaceholder.typicode.com/todos";

const todoListField = document.querySelector(".list");
const button = document.querySelector(".button");
const inputForText = document.querySelector(".todo-text");

// получаю данные и рендерю их
async function getTodoAndRender() {
  // перед рендерингом делаю запрос на сервер 
  const response = await fetch(URL);
  const data = await response.json();
 
  for (let i = 0; i < data.length; i++) {
  
    const todoField = document.createElement("div");
    todoField.classList.add("todo");

    const inputCheckBox = document.createElement("input");
    inputCheckBox.type = "checkbox";
    inputCheckBox.classList.add('#expanced')

    const inputCheckLabel = document.createElement("label");
    inputCheckLabel.for = "expanced"
    inputCheckLabel.style.cursor = "pointer"

    // создаем span для текста
    const spanForText = document.createElement("span");
    spanForText.textContent = data[i]["title"];
    const spanForId = document.createElement("span");
    spanForId.textContent = "id: " + data[i]["id"];
    if (data[i]["completed"]) {
      todoField.style.textDecoration = "line-through";
      inputCheckBox.checked = true;
    }
    // создаем кнопку удаления
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete_button");
    deleteButton.textContent = "X";


    todoField.append(inputCheckBox, spanForId, spanForText, deleteButton);

    todoListField.append(todoField);

    deleteButton.addEventListener("click", (e) => {
      deleteTodo(data[i].id, e.target.parentNode);
    });

    inputCheckBox.addEventListener("click", (e) => {
      if (inputCheckBox.checked) {
        checkTodoCompleted(data[i].id, data[i].checked, e.target.parentNode);
        e.target.parentNode.style.border = "1px solid #EEE";
        // e.target.parentNode.style.background = "#EEE"
      } else {
        e.target.parentNode.style.textDecoration = "none";
        e.target.parentNode.style.border = "none";
      }
    });
  }

  button.addEventListener("click", (e) => {
    // перед добавлением делаю запрос на сервер - FETCHING POST
    addTodo(inputForText.value).then((todo) => {
      inputForText.value = ""; // Обнуляем значения
      
      const todoField = document.createElement("div");
      todoField.classList.add("todo");
    

      const inputCheckBox = document.createElement("input");
      inputCheckBox.type = "checkbox";
    

      const spanForText = document.createElement("span");
      spanForText.textContent = todo.title;
      const spanForId = document.createElement("span");
      spanForId.textContent = "id: " + todo.id;
      // создаем кнопку удаления => x <=
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete_button");
      deleteButton.textContent = "X";

      todoField.append(inputCheckBox, spanForId, spanForText, deleteButton);
      todoListField.append(todoField);

      deleteButton.addEventListener("click", (e) => {
        deleteTodo(todo.id, e.target.parentNode);
      });

      inputCheckBox.addEventListener("change", (e) => {
        if (inputCheckBox.checked) {
          e.target.parentNode.style.textDecoration = "line-through";
          e.target.parentNode.style.border = "1px solid #EEE";
          
        } else {
          e.target.parentNode.style.textDecoration = "none";
          e.target.parentNode.style.border = "none";
        
        }
      });
    });
  });
}
// Функция удаляет тудушку только если удаление на сервере прошло успешно
async function deleteTodo(id, node) {
  const params = {
    method: "DELETE",
  };
  const response = await fetch(URL + `/${id}`, params);
  if (response.status === 200) {
    node.remove();
  } else {
    const header = document.querySelector(".header");
    header.textContent = "ERROR: Couldn't delete Todo";
  }
}
//Добавляю данные на сервер сервер => просто возвращает их обратно
async function addTodo(text) {
  const inputText = {
    title: text,
  };
  const params = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputText),
  };
  const response = await fetch(URL, params);
  if (response.status === 201) {
 
    const data = await response.json();
    return data;
  }
}
// Функция изменяет тудушку только если изменение completed на сервере прошло успешно
async function checkTodoCompleted(id, completed, node) {
  const complete = {
    completed: !completed, // меняю на обратное значение
  };
  const params = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(complete),
  };
  // если прошло успешно меняю Node
  const response = await fetch(URL + `/${id}`, params);
  if (response.status === 200) {
    node.style.textDecoration = "line-through";
    node.style.border = "1px solid #EEE"
  }
}

// запускаю рендер
getTodoAndRender();
