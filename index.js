const express = require("express");
const app = express();
const port = 3000;

// Middleware for parsing body from request
app.use(express.urlencoded({ extended: true }));

// Todo list
let todos = [{ id: 1, todo: "Belajar Express" }];

// Halaman utama Todolist
app.get("/", (req, res) => {
  res.status(200).type("html").send(`
    <h1>Todolist</h1>
    <ul style="list-style:none;">
      ${todos
        .map(
          (todo, index) => `
            <li>${index + 1}. ${todo.todo}
              <form action="/delete/${
                todo.id
              }" method="GET" style="display: inline;">
                <button type="submit">Hapus</button>
              </form>
              <form action="/edit/${
                todo.id
              }" method="GET" style="display: inline;">
                <button type="submit">Edit</button>
              </form>
            </li>
          `
        )
        .join("")}
    </ul>
    <form action="/add" method="POST">
      <input type="text" name="todo" required />
      <button type="submit">Tambah Tugas</button>
    </form>
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

  // Menampilkan form edit jika todo ditemukan
  if (todo) {
    res.status(200).type("html").send(`
      <h1>Edit Todo</h1>
      <form action="/update/${id}" method="POST">
        <input type="text" name="todo" value="${todo.todo}" required />
        <button type="submit">Update</button>
      </form>
      <a href="/">Kembali ke Todolist</a>
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
    todos[todoIndex].todo = req.body.todo; // Update isi todo
    res.status(200).redirect("/"); // Redirect ke halaman utama
  } else {
    res.status(404).send("Todo tidak ditemukan");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
