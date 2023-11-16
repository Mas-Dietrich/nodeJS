// Function to display the todos
function displayTodos() {
    fetch("/api/todos") // Make a GET request to the server to fetch todos
      .then((response) => response.json())
      .then((data) => {
        populateCategoryFilter(); // Update your local todos with the data from the server
  
        const todoList = document.getElementById("todoList");
        todoList.innerHTML = "";
  
        data.forEach((todo) => {
          const li = document.createElement("li");
          li.className = "todo-item"; // Add a class for styling
  
          const statusCheckbox = document.createElement("input");
          statusCheckbox.type = "checkbox";
          statusCheckbox.checked = todo.status;
          statusCheckbox.addEventListener("change", () => toggleStatus(todo.id));

        const titleSpan = document.createElement("span");
        titleSpan.textContent = todo.title;

        const categorySpan = document.createElement("span");
        categorySpan.className = "todo-category";
        categorySpan.textContent = `Category: ${todo.category}`;

        const dueDateSpan = document.createElement("span");
        dueDateSpan.className = "todo-due-date";
        dueDateSpan.textContent = `Due Date: ${todo.dueDate}`;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editTodo(todo.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTodo(todo.id));

        li.appendChild(statusCheckbox);
        li.appendChild(titleSpan);
        li.appendChild(categorySpan);
        li.appendChild(dueDateSpan);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        // Add a class to the li element if the task is completed
        if (todo.status === true) {
          li.classList.add("completed-task");
        }

        todoList.appendChild(li);
      });

      updateTodosLeft();
    })
    .catch((error) => console.error("Error fetching todos:", error));
}

function addTodo() {
    const newTodoInput = document.getElementById("newTodo");
    const newTodoTitle = newTodoInput.value;
    const newCategoryInput = document.getElementById("newCategory").value;
  
    if (newTodoTitle.trim() && newCategoryInput.trim()) {
      const newTodo = {
        title: newTodoTitle,
        category: newCategoryInput,
        status: false,
      };
  
      fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      })
        .then((response) => response.json())
        .then(() => {
          newTodoInput.value = "";
          document.getElementById("newCategory").value = "";
          displayTodos();
          updateTodosLeft();
        })
        .catch((error) => console.error("Error adding todo:", error));
    } else {
      alert("Please enter a valid task title and category.");
    }
  }

// Function to toggle the status of a todo (complete/incomplete)
function toggleStatus(id) {
    const todo = todo.find((todo) => todo.id === id);
    if (todo) {
      todo.status = todo.status === "complete" ? "incomplete" : "complete";
      fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      })
        .then((response) => response.json())
        .then((data) => {
          const index = todo.findIndex((t) => t.id === data.id);
          if (index !== -1) {
            todo[index] = data;
          }
          displayTodos();
          updateTodosLeft();
        })
        .catch((error) => console.error("Error toggling todo status:", error));
    }
  }
    
// Function to edit a todo
function editTodo(id) {
    const todo = todo.find((todo) => todo.id === id);
    if (todo) {
      const newTitle = prompt("Edit todo:", todo.title);
      if (newTitle !== null) {
        todo.title = newTitle;
        fetch(`/api/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        })
          .then(() => displayTodos())
          .catch((error) => console.error("Error editing todo:", error));
      }
    }
  }

// Function to delete a todo
function deleteTodo(id) {
    fetch(`/api/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => displayTodos())
      .catch((error) => console.error("Error deleting todo:", error));
  }

/* function clearCompletedTodos() {
    fetch("/api/todos/status", {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 200) {
          // Successfully cleared on the server, remove completed todos from your local todos
          todos = todos.filter((todo) => todo.status === false);
          displayTodos();
          updateTodosLeft();
        } else {
          console.error("Error clearing completed todos:", response.statusText);
        }
      })
      .catch((error) => console.error("Error clearing completed todos:", error));
  } */

  let clearCompletedTodos = document.querySelector('#clearCompletedTodos')

  clearCompletedTodos.addEventListener('click', () => {
    fetch('api/todo/status', {
        method: "DELETE",
    })

    .then((res) => res.json())
    .then((data) => displayTodos())
  })
  
  function updateTodosLeft() {
    fetch("/api/todos") // Fetch todos from the server
      .then((response) => response.json())
      .then((todos) => {
        const incompleteTodos = todos.filter((todo) => todo.status === false);
        const todosLeftText = `${incompleteTodos.length} todos left to complete`;
        document.getElementById("todosLeft").textContent = todosLeftText;
      })
      .catch((error) => console.error("Error fetching todos:", error));
  }

function populateCategoryFilter() {
    const categoryFilter = document.getElementById("categoryFilter");
  
    fetch("/api/categories") // Fetch categories from the server
      .then((response) => response.json())
      .then((categories) => {
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = category;
          categoryFilter.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }

  function filterByCategory() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;

  if (selectedCategory === "all") {
    displayTodos();
  } else {
    fetch(`/api/todos/category/${selectedCategory}`) // Fetch todos for the selected category
      .then((response) => response.json())
      .then((filteredTodos) => displayFilteredTodos(filteredTodos))
      .catch((error) => console.error("Error fetching todos by category:", error));
  }
}

function displayFilteredTodos(filteredTodos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const statusCheckbox = document.createElement("input");
    statusCheckbox.type = "checkbox";
    statusCheckbox.checked = todo.status === "complete";
    statusCheckbox.addEventListener("change", () => toggleStatus(todo.id));

    const titleSpan = document.createElement("span");
    titleSpan.textContent = todo.title;

    const categorySpan = document.createElement("span");
    categorySpan.className = "todo-category";
    categorySpan.textContent = `Category: ${todo.category}`;

    const dueDateSpan = document.createElement("span");
    dueDateSpan.className = "todo-due-date";
    dueDateSpan.textContent = `Due Date: ${todo.dueDate}`;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editTodo(todo.id));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(statusCheckbox);
    li.appendChild(titleSpan);
    li.appendChild(categorySpan);
    li.appendChild(dueDateSpan);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    if (todo.status === "complete") {
      li.classList.add("completed-task");
    }

    todoList.appendChild(li);
  });

  updateTodosLeft();
}

// Function to check if a category already exists
function categoryExists(categoryName) {
  const categoryFilter = document.getElementById("categoryFilter");
  return Array.from(categoryFilter.options).some(
    (option) => option.value === categoryName
  );
}

function deleteCategory() {
    const categoryFilter = document.getElementById("categoryFilter");
    const selectedCategory = categoryFilter.value;
  
    if (selectedCategory === "all") {
      alert("Please select a category to delete.");
      return;
    }
  
    fetch(`/api/categories/${selectedCategory}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 200) {
          // Successfully deleted on the server, remove it from the dropdown
          populateCategoryFilter(); // Update the categories in the dropdown
          displayTodos();
          clearCompletedTodos();
        } else {
          console.error("Error deleting category:", response.statusText);
        }
      })
      .catch((error) => console.error("Error deleting category:", error));
  }

// Function to check if a category has incompleted tasks
function hasincompletedTasksInCategory(category) {
  return todos.some(
    (todo) => todo.category === category && todo.status === "incomplete"
  );
}

function editCategory() {
  const categoryFilter = document.getElementById("categoryFilter");
  const editCategoryInput = document.getElementById("editCategory");
  const selectedCategory = categoryFilter.value;
  const editedCategory = editCategoryInput.value.trim();

  if (selectedCategory === "all") {
    alert("Please select a category to edit.");
    return;
  }

  if (editedCategory) {
    // Check if the edited category already exists
    if (!categoryExists(editedCategory)) {
      // Update the category name in the filter dropdown
      categoryFilter.options[categoryFilter.selectedIndex].text =
        editedCategory;
      editCategoryInput.value = ""; // Clear the input field

      // Update the category name for all relevant todos
      todos.forEach((todo) => {
        if (todo.category === selectedCategory) {
          todo.category = editedCategory;
        }
      });

      // Filter the todos based on the edited category and display them
      const filteredTodos = todos.filter(
        (todo) => todo.category === editedCategory
      );
      displayFilteredTodos(filteredTodos);
    } else {
      alert("Category already exists.");
    }
  } else {
    alert("Please enter a valid category name.");
  }
}

displayTodos();

populateCategoryFilter();