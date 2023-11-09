let todos = [
    {
        id: 0,
        title: "Do Homework",
        status: "incomplete",
        category: "DGM3760",
        dueDate: "2023-11-10"
    },
    {
        id: 1,
        title: "Walk the dog",
        status: "incomplete",
        category: "Home",
        dueDate: "2023-11-08"
    },
    {
        id: 2,
        title: "Push code",
        status: "complete",
        category: "Work",
        dueDate: "2023-11-12"
    }
]

// Function to display the todos
function displayTodos() {
    fetch('/api/todos') // Make a GET request to the server to fetch todos
        .then(response => response.json())
        .then(data => {
            todos = data; // Update your local todos with the data from the server

            const todoList = document.getElementById("todoList");
            todoList.innerHTML = "";

            todos.forEach(todo => {
                const li = document.createElement("li");
                li.className = "todo-item"; // Add a class for styling

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

                // Add a class to the li element if the task is completed
                if (todo.status === "complete") {
                    li.classList.add("completed-task");
                }

                todoList.appendChild(li);
            });

            updateTodosLeft();
        })
        .catch(error => console.error('Error fetching todos:', error));
}

// Function to add a new todo
function addTodo() {
    const newTodoInput = document.getElementById("newTodo");
    const newTodoTitle = newTodoInput.value;
    const newCategoryInput = document.getElementById("newCategory").value;

    if (newTodoTitle.trim() && newCategoryInput.trim()) {
        const newTodo = {
            title: newTodoTitle,
            category: newCategoryInput,
        };

        fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo),
        })
            .then(response => response.json())
            .then(data => {
                todos.push(data); // Add the newly created todo to your local todos array
                newTodoInput.value = "";
                document.getElementById("newCategory").value = ""; // Clear the category input field
                displayTodos();
            })
            .catch(error => console.error('Error adding todo:', error));
    } else {
        alert("Please enter a valid task title and category.");
    }
}

// Function to toggle the status of a todo (complete/incomplete)
function toggleStatus(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.status = todo.status === "complete" ? "incomplete" : "complete";
        displayTodos();
    }
}

// Function to edit a todo
function editTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        const newTitle = prompt("Edit todo:", todo.title);
        if (newTitle !== null) {
            todo.title = newTitle;
            fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todo),
            })
                .then(response => response.json())
                .then(data => {
                    // The server may return the updated todo, so update your local todos accordingly
                    const index = todos.findIndex(t => t.id === data.id);
                    if (index !== -1) {
                        todos[index] = data;
                    }
                    displayTodos();
                })
                .catch(error => console.error('Error editing todo:', error));
        }
    }
}

// Function to delete a todo
function deleteTodo(id) {
    fetch(`/api/todos/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.status === 200) {
                // Successfully deleted on the server, remove it from your local todos
                todos = todos.filter(todo => todo.id !== id);
                displayTodos();
            } else {
                console.error('Error deleting todo:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting todo:', error));
}

// Function to clear all completed todos
function clearCompletedTodos() {
    fetch('/api/todos', {
        method: 'DELETE',
    })
        .then(response => {
            if (response.status === 200) {
                // Successfully cleared on the server, remove completed todos from your local todos
                todos = todos.filter(todo => todo.status === "incomplete");
                displayTodos();
            } else {
                console.error('Error clearing completed todos:', response.statusText);
            }
        })
        .catch(error => console.error('Error clearing completed todos:', error));
}

// Function to update the "number of todos left to complete" text
function updateTodosLeft() {
    const incompleteTodos = todos.filter(todo => todo.status === "incomplete");
    const todosLeftText = `${incompleteTodos.length} todos left to complete`;
    document.getElementById("todosLeft").textContent = todosLeftText;
}

function populateCategoryFilter() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = [...new Set(todos.map(todo => todo.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function filterByCategory() {
    const categoryFilter = document.getElementById("categoryFilter");
    const selectedCategory = categoryFilter.value;

    if (selectedCategory === "all") {
        displayTodos();
    } else {
        const filteredTodos = todos.filter(todo => todo.category === selectedCategory);
        displayFilteredTodos(filteredTodos);
    }
}

function displayFilteredTodos(filteredTodos) {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";

    filteredTodos.forEach(todo => {
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


/* function addCategory() {
    const newCategoryInput = document.getElementById("newCategory");
    const newCategoryName = newCategoryInput.value.trim();

    if (newCategoryName) {
        if (!categoryExists(newCategoryName)) {
            const categoryFilter = document.getElementById("categoryFilter");
            const newCategoryOption = document.createElement("option");
            newCategoryOption.value = newCategoryName;
            newCategoryOption.textContent = newCategoryName;
            categoryFilter.appendChild(newCategoryOption);
            newCategoryInput.value = '';
        } else {
            alert("Category already exists.");
        }
    } else {
        alert("Please enter a valid category name.");
    }
} */



// Function to check if a category already exists
function categoryExists(categoryName) {
    const categoryFilter = document.getElementById("categoryFilter");
    return Array.from(categoryFilter.options).some(option => option.value === categoryName);
}

function deleteCategory() {
    const categoryFilter = document.getElementById("categoryFilter");
    const selectedCategory = categoryFilter.value;

    if (selectedCategory === "all") {
        alert("Please select a category to delete.");
        return;
    }

    const incompletedTasksInCategory = todos.some(todo => todo.category === selectedCategory && todo.status === "incomplete");

    if (incompletedTasksInCategory) {
        const confirmation = confirm("There are incompleted tasks in this category. Are you sure you want to delete it?");
        if (!confirmation) {
            return;
        }
    }

    categoryFilter.remove(categoryFilter.selectedIndex);
    displayTodos();
    clearCompletedTodos();
}

// Function to check if a category has incompleted tasks
function hasincompletedTasksInCategory(category) {
    return todos.some(todo => todo.category === category && todo.status === "incomplete");
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
            categoryFilter.options[categoryFilter.selectedIndex].text = editedCategory;
            editCategoryInput.value = ""; // Clear the input field

            // Update the category name for all relevant todos
            todos.forEach(todo => {
                if (todo.category === selectedCategory) {
                    todo.category = editedCategory;
                }
            });

            // Filter the todos based on the edited category and display them
            const filteredTodos = todos.filter(todo => todo.category === editedCategory);
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