import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        return Array.isArray(parsedTasks) ? parsedTasks : [];
      } catch (error) {
        console.error("Error parsing tasks from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === "") return;
    const newTask = {
      id: uuidv4(),
      text: input,
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setInput("");
  };

  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <div className="todo-content">
        <h1>To-Do List</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter a task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") addTask();
            }}
          />
          <button onClick={addTask} className="add-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add
          </button>
        </div>
        <div className="filters">
          {["All", "Active", "Completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "active" : ""}
            >
              {f}
            </button>
          ))}
        </div>
        <ul className="task-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`task-item ${task.completed ? "completed" : ""}`}
              >
                <div className="task-content">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="toggle-button"
                  >
                    {task.completed && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                  <span className="task-text">{task.text}</span>
                </div>
                <button
                  onClick={() => removeTask(task.id)}
                  className="remove-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </li>
            ))
          ) : (
            <li className="no-tasks">No tasks available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default App;
