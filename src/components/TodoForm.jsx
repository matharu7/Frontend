

  // todoform.jsx
import { useState } from "react";
import axios from "axios";

function TodoForm({ onAdd }) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await axios.post("/api/todos", { text });
    onAdd(res.data);
    setText("");
  };

  return (
  <form className="todo-form" onSubmit={handleSubmit}>
  <input
    type="text"
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="What do you need to do?"
    className="add-input"
  />
  <button type="submit" className="add-btn">Add Task</button>
</form>

  );
}

export default TodoForm;









