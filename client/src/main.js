//DISPLAYING TODOS

//User can view todos
function fetchTodos() {
    fetch("/api/todos")
      .then((response) => response.json())
      .then((data) => {
        // Call a function to display the todos on the front end
        displayTodos(data);
      })
      .catch((error) => console.error("Error fetching todos:", error));
  }
  
  // Update the displayTodos function
  function displayTodos(todos) {
    const todoList = document.getElementById("todoList");
    const todosLeft = document.getElementById("todosLeft");
  
    // Clear the existing list
    todoList.innerHTML = "";
  
    let incompleteCount = 0; // Initialize the count of incomplete todos
  
    // Loop through the todos and append only incomplete ones to the list
    todos.forEach((todo) => {
      const listItem = document.createElement("li");
  
      // Display todo details
      const todoDetailsContainer = document.createElement("div");
      const titleElement = document.createElement("h2");
      titleElement.textContent = todo.title;
  
      const categoryElement = document.createElement("h3");
      categoryElement.textContent = todo.category;
      categoryElement.style.fontStyle = "italic";
      categoryElement.style.fontSize = "smaller";
  
      const dueDateElement = document.createElement("h4");
      dueDateElement.textContent = todo.dueDate;
      dueDateElement.style.fontStyle = "italic";
  
      todoDetailsContainer.appendChild(titleElement);
      todoDetailsContainer.appendChild(categoryElement);
      todoDetailsContainer.appendChild(dueDateElement);
  
      listItem.appendChild(todoDetailsContainer);
  
      // Toggle todo progress button
      const statusButton = document.createElement("button");
      statusButton.textContent = todo.status ? "Done" : "In Progress";
      statusButton.addEventListener("click", () => toggleTodoStatus(todo.id));
  
      listItem.appendChild(statusButton);
  
      // Add an edit button to each todo item
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editTodo(todo.id));
  
      // Add a delete button to each todo item
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteTodo(todo.id));
  
      listItem.appendChild(editButton);
      listItem.appendChild(deleteButton);
  
      // Apply completed-task class if the todo is completed
      if (todo.status) {
        listItem.classList.add("completed-task");
      }
  
      todoList.appendChild(listItem);
  
      if (!todo.status) {
        incompleteCount++; // Increment the count for each incomplete todo
      }
    });
  
    // Update the display of incomplete todos count
    todosLeft.textContent =
      incompleteCount === 1
        ? "1 todo left to complete"
        : `${incompleteCount} todos left to complete`;
  }
  
  // Add a function to toggle the todo status
  function toggleTodoStatus(todoId) {
    fetch(`/api/todo/status/${todoId}`, {
      method: "PUT",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.message); // Log the success message
        fetchTodos(); // Fetch and display updated todos
      })
      .catch((error) => console.error("Error toggling todo status:", error));
  }
  
  function fetchTodosCount() {
    fetch("/api/todos/count")
      .then((response) => response.json())
      .then((data) => {
        // Call a function to update the todos count on the front end
        updateTodosCount(data.count);
      })
      .catch((error) => console.error("Error fetching todos count:", error));
  }
  
  function updateTodosCount(count) {
    const todosLeft = document.getElementById("todosLeft");
    todosLeft.textContent =
      count === 1 ? "1 todo left to complete" : `${count} todos left to complete`;
  }
  
  //CATEGORIES
  
  // Fetch and populate categories
  function fetchCategories() {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        // Call a function to update the categories in the dropdown
        updateCategories(data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }
  
  // Function to update categories in the dropdown for filtering todos
  function updateCategoryFilter(categories) {
    const categoryFilterDropdown = document.getElementById("categoryFilter");
    categoryFilterDropdown.innerHTML = ""; // Clear existing options
  
    // Add an option for filtering by all categories
    const allCategoriesOption = document.createElement("option");
    allCategoriesOption.value = "all";
    allCategoriesOption.textContent = "All Categories";
    categoryFilterDropdown.appendChild(allCategoriesOption);
  
    // Add each category as an option
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilterDropdown.appendChild(option);
    });
  }
  
  // Function to update categories in the dropdown for adding todos
  function updateCategories(categories) {
    const categorySelector = document.getElementById("categorySelector");
    categorySelector.innerHTML = ""; // Clear existing options
  
    //USERS NEED TO BE ABLE TO ADD CATEGORIES
    // Add an option for adding a new category
    const addNewCategoryOption = document.createElement("option");
    addNewCategoryOption.value = "new";
    addNewCategoryOption.textContent = "Select a Category";
    categorySelector.appendChild(addNewCategoryOption);
  
    // Add each category as an option
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelector.appendChild(option);
    });
  }
  
  //USER NEEDS TO BE ABLE TO VIEW TODOS BY CATEGORY
  function filterByCategory() {
    const selectedCategory = document.getElementById("categoryFilter").value;
  
    // If "All Categories" is selected, fetch all todos
    const url =
      selectedCategory === "all"
        ? "/api/todos"
        : `/api/todos/category/${selectedCategory}`;
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Call a function to display the filtered todos
        displayTodos(data);
      })
      .catch((error) => console.error("Error fetching filtered todos:", error));
  }
  
  document.addEventListener("DOMContentLoaded", fetchCategoriesAndFilter);
  
  function fetchCategoriesAndFilter() {
    // Fetch categories
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        // Update the categories in the dropdown for adding todos
        updateCategories(data);
  
        // Update the categories in the dropdown for filtering todos
        updateCategoryFilter(data);
  
        // Attach the filterByCategory function to be called when categories are fetched
        document
          .getElementById("categoryFilter")
          .addEventListener("change", filterByCategory);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }
  
  //USER NEEDS TO BE ABLE TO DELETE CATEGORIES
// Function to delete a category
function deleteCategory() {
    const selectedCategory = document.getElementById("categoryFilter").value;
  
    if (!selectedCategory || selectedCategory === "all") {
      alert("Please select a valid category to delete.");
      return;
    }
  
    // Confirm deletion with the user
    const confirmDelete = confirm(
      `Are you sure you want to delete the category "${selectedCategory}"?`
    );
  
    if (confirmDelete) {
      // Fetch todos in the selected category
      fetch(`/api/todos/category/${selectedCategory}`)
        .then((response) => response.json())
        .then((todosToDelete) => {
          // Delete each todo in the selected category
          const deletePromises = todosToDelete.map((todo) => {
            return fetch(`/api/todos/${todo.id}`, {
              method: "DELETE",
            })
              .then((res) => res.json())
              .then(() => {
                console.log(`Todo with id ${todo.id} deleted successfully.`);
              })
              .catch((error) =>
                console.error(`Error deleting todo with id ${todo.id}:`, error)
              );
          });
  
          // After deleting all the todos, trigger the deletion of the category
          Promise.all(deletePromises).then(() => {
            // Delete the category
            fetch(`/api/categories/${selectedCategory}`, {
              method: "DELETE",
            })
              .then((res) => res.json())
              .then(() => {
                console.log(`Category "${selectedCategory}" deleted successfully.`);
                fetchTodos();
                fetchCategoriesAndFilter(); // Fetch and update the categories for the filter dropdown
              })
              .catch((error) =>
                console.error(
                  `Error deleting category "${selectedCategory}":`,
                  error
                )
              );
          });
        })
        .catch((error) =>
          console.error(
            "Error fetching todos in the selected category:",
            error
          )
        );
    }
  }
  
  
  document
    .getElementById("deleteCategoryButton")
    .addEventListener("click", deleteCategory);
  
  //USER NEEDS TO BE ABLE TO EDIT CATEGORIES
  // Function to edit a category name
  function editCategory() {
    const oldCategoryName = document.getElementById("categoryFilter").value;
    const newCategoryName = document.getElementById("editCategory").value.trim();
  
    if (!oldCategoryName || oldCategoryName === "all") {
      alert("Please select a valid category to edit.");
      return;
    }
  
    if (!newCategoryName || newCategoryName === "") {
      alert("Please provide a valid new category name.");
      return;
    }
  
    const existingCategories = Array.from(
      document.getElementById("categoryFilter").options
    ).map((option) => option.value);
    if (existingCategories.includes(newCategoryName)) {
      alert("Category name already exists. Please choose a different name.");
      return;
    }
  
    // Confirm editing with the user
    const confirmEdit = confirm(
      `Are you sure you want to edit the category name from "${oldCategoryName}" to "${newCategoryName}"?`
    );
  
    if (confirmEdit) {
      fetch(`/api/categories/${oldCategoryName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newCategoryName }),
      })
        .then((response) => response.json())
        .then((data) => {
          // After editing the category name, fetch and update the categories for the filter dropdown
          fetchTodos();
          fetchCategoriesAndFilter();
        })
        .catch((error) => console.error("Error editing category:", error));
    }
  }
  
  document
    .getElementById("editCategoryButton")
    .addEventListener("click", editCategory);
  
  //TODOS
  
  // Function to add a new todo
  function addTodo() {
    const newTodoInput = document.getElementById("newTodo");
    const categorySelector = document.getElementById("categorySelector");
    const newCategoryInput = document.getElementById("newCategory");
  
    const selectedCategory = categorySelector.value;
    let categoryToAdd;
  
    // Check if the user selected an existing category or chose to add a new one
    if (selectedCategory === "new") {
      // Use the new category input if the user chose to add a new category
      categoryToAdd = newCategoryInput.value.trim();
    } else {
      // Use the selected category from the dropdown
      categoryToAdd = selectedCategory;
    }
  
    // Check if either the todo title or category is empty
    if (!newTodoInput.value.trim() || !categoryToAdd) {
      alert("Please enter both a todo title and select or add a category.");
      return; // Stop execution if validation fails
    }
  
    const newTodo = {
      title: newTodoInput.value,
      category: categoryToAdd,
      status: false,
    };
  
    // Make a POST request to add the new todo
    fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((data) => {
        // After adding the todo, fetch and display updated todos
        fetchTodos();
        // Fetch and update the categories for the filter dropdown
        fetchCategoriesAndFilter();
      })
      .catch((error) => console.error("Error adding todo:", error));
  
    // Clear input fields after adding todo
    newTodoInput.value = "";
    categorySelector.value = "";
    newCategoryInput.value = "";
  }
  
  // Attach the addTodo function to the "Add" button click event
  const addButton = document.querySelector("#addTodo");
  addButton.addEventListener("click", addTodo);
  
  //User can edit todos
  function editTodo(todoId) {
    const updatedTitle = prompt("Enter the updated title:");
  
    // Check if the entered title is not null, not an empty string, and not just whitespace
    if (updatedTitle !== null && updatedTitle.trim() !== "") {
      fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: updatedTitle }),
      })
        .then((response) => response.json())
        .then((data) => {
          // After editing the todo, fetch and display updated todos
          fetchTodos();
        })
        .catch((error) => console.error("Error editing todo:", error));
    } else {
      // Handle the case where the user entered an empty or blank title
      alert("Invalid title. Please enter a todo title.");
    }
  }
  
  //User can delete todos
  function deleteTodo(todoId) {
    const confirmDelete = confirm("Are you sure you want to delete this todo?");
  
    if (confirmDelete) {
      fetch(`/api/todos/${todoId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          // After deleting the todo, fetch and display updated todos
          fetchTodos();
        })
        .catch((error) => console.error("Error deleting todo:", error));
    }
  }
  
  const clearCompletedButton = document.getElementById("clearCompletedTodos");

  clearCompletedButton.addEventListener("click", () => {
    // Send a DELETE request to clear completed todos
    fetch("/api/todos/status", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        // Display the updated list of todos
        fetchTodos();
      })
      .catch((error) => {
        console.error("Error clearing completed todos:", error);
  
        // Add this line to handle non-JSON responses (e.g., HTML error page)
        alert("Error clearing completed todos. Please try again.");
      });
  });
  
  
  // Initial fetch when the page loads
  fetchTodos();
  fetchTodosCount();