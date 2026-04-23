import { useState } from "react";
import axios from "axios";

function TodoItem({ todo, onDelete, onToggle }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/todos/${todo._id}`);
      onDelete(todo._id);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleToggle = async () => {
    try {
      const res = await axios.put(`/api/todos/${todo._id}`, {
        completed: !todo.completed,
      });
      onToggle(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
        {todo.text}
      </span>
      <button onClick={handleDelete} disabled={loading} className="delete-btn">
        {loading ? "Deleting..." : "Delete Task"}
      </button>
    </div>
  );
}

export default TodoItem;
