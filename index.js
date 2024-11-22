const express = require("express");
const app = express();
const port = 3000;

// Middleware for parsing body from request
app.use(express.urlencoded({ extended: true }));

// Todo list
let todos = [{ id: 1, todo: "Belajar Express" }];

// Halaman utama Todolist
app.get("/", (req, res) => {
  const todoListHtml = todos
    .map(
      (todo, index) => `
      <li style="border: 1px solid #ddd; padding: 10px; margin: 5px; border-radius: 5px;">
        ${index + 1}. ${todo.todo}
        <form action="/edit/${todo.id}" method="GET" style="display: inline;">
          <button type="submit">Edit</button>
        </form>
        <form action="/delete/${todo.id}" method="GET" style="display: inline;">
          <button type="submit">Hapus</button>
        </form>
      </li>`
    )
    .join("");

  res.status(200).type("html").send(`
    <div style="width: 50%; margin: 20px auto; font-family: Arial, sans-serif; text-align: center;">
      <h1 style="border-bottom: 2px solid #ddd; padding-bottom: 10px;">Todolist</h1>
      <ul style="list-style: none; padding: 0;">
        ${todoListHtml}
      </ul>
      <form action="/add" method="POST" style="margin-top: 20px;">
        <input 
          type="text" 
          name="todo" 
          required 
          style="width: 70%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" 
          placeholder="Masukkan tugas baru"
        />
        <button type="submit" style="padding: 10px 15px; border: none; background-color: #4CAF50; color: white; border-radius: 5px; cursor: pointer;">
          Tambah Tugas
        </button>
      </form>
    </div>
  `);
});

// Menambahkan todo baru
app.post("/add", (req, res) => {
  const newTodo = { id: todos.length + 1, todo: req.body.todo };
  todos.push(newTodo);
  res.status(201).redirect("/");
});

// Menghapus todo berdasarkan id
app.get("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter((todo) => todo.id !== id);
  res.status(204).redirect("/");
});

// Menampilkan form edit untuk mengubah isi todo
app.get("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (todo) {
    res.status(200).type("html").send(`
      <div style="width: 50%; margin: 20px auto; font-family: Arial, sans-serif; text-align: center;">
        <h1 style="border-bottom: 2px solid #ddd; padding-bottom: 10px;">Edit Todo</h1>
        <form action="/update/${id}" method="POST" style="margin-top: 20px;">
          <input 
            type="text" 
            name="todo" 
            value="${todo.todo}" 
            required 
            style="width: 70%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"
          />
          <button type="submit" style="padding: 10px 15px; border: none; background-color: #2196F3; color: white; border-radius: 5px; cursor: pointer;">
            Update
          </button>
        </form>
        <a href="/" style="display: inline-block; margin-top: 20px; text-decoration: none; color: #2196F3;">Kembali ke Todolist</a>
      </div>
    `);
  } else {
    res.status(404).send("Todo tidak ditemukan");
  }
});

// Menghandle update todo berdasarkan id
app.post("/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex !== -1) {
    todos[todoIndex].todo = req.body.todo;
    res.status(200).redirect("/");
  } else {
    res.status(404).send("Todo tidak ditemukan");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
