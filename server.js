const express = require('express')
const { restart } = require('nodemon')
const app = express()
const port = 3000

const bodyParser = require('body-parser')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/new', (req, res) => {
    res.send('This is a new route!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(express.json())

let todos = [
    {
        id: 0,
        title: "Do Homework",
        completedStatus: false,
        category: "DGM3760"
    },
    {
        id: 1,
        title: "Walk the dog",
        completedStatus: false,
        category: "Home"
    },
    {
        id: 2,
        title: "Push code",
        completedStatus: true,
        category: "Work"
    }
]

//GET TODOS
app.get('/api/todos', (req, res) => {
    res.send(todos)
})

//POST TODO
app.post('/api/todos', (req, res) => {
    todos.push({
        id: todos.length + 1,
        title: req.body.title,
        completedStatus: false,
        category: req.body.category
    })
})

//PUT TODO
app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    const updatedTodo = todos.find((todo) => todo.id === id)
    if(!updatedTodo) {
        res.status(404).send('Todo Not Found')
    } else {
        // Update the todo item with the data from the request body
        updatedTodo.title = req.body.title || updatedTodo.title;
        updatedTodo.completedStatus = req.body.completedStatus || updatedTodo.completedStatus;
        updatedTodo.category = req.body.category || updatedTodo.category;

        res.send(updatedTodo);
        
    }
})

//DELETE TODO
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const deletedTodoIndex = todos.findIndex((todo) => todo.id === id)

    if (deletedTodoIndex === -1) {
        res.status(404).send('Todo not found');
      } else {
        // Remove the specified todo item from the array
        todos.splice(deletedTodoIndex, 1);
        res.send('Todo deleted successfully');
      }
})

//GET TODOS FOR A CATEGORY
app.get('/api/todos', (req, res) => {
    const category = req.query.category;
  
    if (!category) {
      res.status(400).send('Category parameter is missing');
      return;
    }
  
    const todosByCategory = todos.filter((todo) => todo.category === category);
  
    if (todosByCategory.length === 0) {
      res.status(404).send('No todos found for this category');
    } else {
      res.send(todosByCategory);
    }
  });

//GET CATEGORIES

app.get('/api/categories', (req, res) => {
    const categories = todos.map((todo) => todo.category);
    const uniqueCategories = [...new Set(categories)]; // Use Set to get unique values
  
    res.send(uniqueCategories);
  });

//POST CATEGORIES
app.post('/api/categories', (req, res) => {
    const newCategory = req.body.category;
  
    if (!newCategory) {
      res.status(400).send('Category is missing in the request body');
    } else {
      // Check if the category already exists
      const categoryExists = todos.some((todo) => todo.category === newCategory);
  
      if (categoryExists) {
        res.status(409).send('Category already exists');
      } else {
        // Create a new category
        todos.push({
          id: todos.length,
          title: '',
          completedStatus: false,
          category: newCategory,
        });
        res.status(201).send('Category created successfully');
      }
    }
  });
    
  //PUT CATEGORIES (update)
  app.put('/api/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedCategory = req.body.category;
  
    if (!updatedCategory) {
      res.status(400).send('Category is missing in the request body');
    } else {
      const todoToUpdate = todos.find((todo) => todo.id === id);
  
      if (!todoToUpdate) {
        res.status(404).send('Todo not found');
      } else {
        // Check if the updated category already exists
        const categoryExists = todos.some((todo) => todo.category === updatedCategory);
  
        if (categoryExists) {
          res.status(409).send('Category already exists');
        } else {
          // Update the category of the specified todo
          todoToUpdate.category = updatedCategory;
          res.send('Category updated successfully');
        }
      }
    }
  });

// DELETE CATEGORY
app.delete('/api/categories/:category', (req, res) => {
    const categoryToDelete = req.params.category;
  
    // Check if any todo is using the category
    const todosUsingCategory = todos.filter((todo) => todo.category === categoryToDelete);
  
    if (todosUsingCategory.length > 0) {
      res.status(409).send('Cannot delete category as it is in use by one or more todos');
    } else {
      // Remove the category from the todos
      todos = todos.filter((todo) => todo.category !== categoryToDelete);
      res.send('Category deleted successfully');
    }
  });
  