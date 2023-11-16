const express = require("express");
const { restart } = require("nodemon");
const app = express();
const port = 3000;

app.use(express.static("client"));
app.use(express.json());

const todos = [
  {
    id: 0,
    title: "Do Homework",
    status: false,
    category: "DGM3760",
    dueDate: "2023-11-10",
  },
  {
    id: 1,
    title: "Walk the dog",
    status: false,
    category: "Home",
    dueDate: "2023-11-08",
  },
  {
    id: 2,
    title: "Push code",
    status: true,
    category: "Work",
    dueDate: "2023-11-12",
  },
];

const bodyParser = require("body-parser");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//GETS ALL TODOS
app.get("/todos", (req, res) => {
  res.json(todos);
});

//POSTS TODOS
app.post("/todos", (req, res) => {
  const newTodo = req.body;

  newTodo.id = todos.length;

  todos.push(newTodo);

  res.json(todos);
});

//UPDATES TODOS
app.put("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const updatedTodo = req.body;

  // Find the todo with the specified id and update its title
  const todoToUpdate = todos.find((todo) => todo.id === todoId);
  if (todoToUpdate) {
    todoToUpdate.title = updatedTodo.title;
    res.json(todos);
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

//DELETES TODOS
app.delete("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);

  // Remove the todo with the specified id
  const indexToRemove = todos.findIndex((todo) => todo.id === todoId);
  if (indexToRemove !== -1) {
    todos.splice(indexToRemove, 1);
    res.json(todos);
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

//UPDATES THE COUNT OF TODOS LEFT
app.get("/todos/count", (req, res) => {
  const incompleteTodos = todos.filter((todo) => !todo.status);
  res.json({ count: incompleteTodos.length });
});

//CLEARS COMPLETED TODOS
app.delete("/api/todo/status", (req, res) => {
  // Filter out completed todos
  todos = todos.filter((todo) => !todo.status);

  // Send a simple success message as a response
  res.status(200).json({ message: "Completed todos cleared successfully" });
});

//GETS CATEGORIES
//Gets Categories
// Endpoint to fetch unique categories
app.get("/categories", (req, res) => {
  const uniqueCategories = [...new Set(todos.map((todo) => todo.category))];
  res.json(uniqueCategories);
});

//GETS TODO BY CATEGORY
// Endpoint to fetch todos by category
app.get("/todos/category/:category", (req, res) => {
  const categoryToFilter = req.params.category;
  const filteredTodos = todos.filter(
    (todo) => todo.category === categoryToFilter
  );
  res.json(filteredTodos);
});

//DELETES CATEGORY
//Endpoint to delete a category if there are no incomplete todos
app.delete("/categories/:category", (req, res) => {
  const categoryToDelete = req.params.category;

  // Check if there are incomplete todos in the specified category
  const hasIncompleteTodos = todos.some(
    (todo) => todo.category === categoryToDelete && !todo.status
  );

  if (hasIncompleteTodos) {
    res.status(400).json({
      error:
        "Cannot delete category with incomplete todos. Complete or delete the todos first.",
    });
  } else {
    // Remove the category from the todos
    todos.forEach((todo) => {
      if (todo.category === categoryToDelete) {
        delete todo.category;
      }
    });

    // Send a success message as a response
    res.status(200).json({ message: "Category deleted successfully." });
  }
});

//UPDATES CATEGORY NAME:

// Endpoint to edit a category name
app.put("/categories/:category", (req, res) => {
  const oldCategoryName = req.params.category;
  const newCategoryName = req.body.newCategoryName;

  // Check if the new category name is provided
  if (!newCategoryName || newCategoryName.trim() === "") {
    res
      .status(400)
      .json({ error: "Please provide a valid new category name." });
    return;
  }

  // Check if the category exists
  const categoryExists = todos.some(
    (todo) => todo.category === oldCategoryName
  );

  if (!categoryExists) {
    res.status(404).json({ error: "Category not found." });
    return;
  }

  // Update the category name for all todos with the old category name
  todos.forEach((todo) => {
    if (todo.category === oldCategoryName) {
      todo.category = newCategoryName;
    }
  });

  res.status(200).json({ message: "Category name updated successfully." });
});

//UPDATES COMPLETION STATUS OF TODO:

// Update the server route for toggling todo status
app.put("/api/todo/status/:id", (req, res) => {
  const todoId = parseInt(req.params.id);

  // Find the todo with the specified id and toggle its status
  const todoToUpdate = todos.find((todo) => todo.id === todoId);
  if (todoToUpdate) {
    todoToUpdate.status = !todoToUpdate.status;
    res.status(200).json({ message: "Todo status toggled successfully" });
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});
