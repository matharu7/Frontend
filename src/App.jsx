import { useEffect, useState } from "react";
import axios from "axios";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import "./index.css";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      const res = await axios.get("/api/todos");
      setTodos(res.data);
    }
    fetchTodos();
  }, []);

  const addTodo = (newTodo) => setTodos([newTodo, ...todos]);

  const toggleTodo = (updatedTodo) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === updatedTodo._id ? updatedTodo : todo
      )
    );
  };

  const deleteTodo = (id) =>
    setTodos(todos.filter((t) => t._id !== id));

  return (
    <div className={dark ? "todo-container dark container" : "todo-container container"}>
      
      <h2>New Version Deployed 🚀</h2>

      <button onClick={() => setDark(!dark)}>
        Toggle Theme
      </button>

      <p>Total Todos: {todos.length}</p>

      <TodoForm onAdd={addTodo} />

      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onDelete={deleteTodo}
          onToggle={toggleTodo}
        />
      ))}
    </div>
  );
}

export default App;
