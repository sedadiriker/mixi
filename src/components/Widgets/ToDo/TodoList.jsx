import React, { useState, useEffect } from "react";
import "./Todo.css";
import Modal from "./Modal-todo";
import Swal from "sweetalert2";

const TodoList = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (!Array.isArray(savedTasks)) {
      console.error("Tasks is not an array:", savedTasks);
      return [];
    }
    return savedTasks;
  });

  const maxChars = 50;

  useEffect(() => {
    const defaultTasks = [
      { id: 1, text: "Buy groceries", completed: false },
      { id: 2, text: "Walk the dog", completed: false },
      { id: 3, text: "Read a book", completed: false },
      { id: 4, text: "Prepare dinner", completed: false },
      { id: 5, text: "Complete homework", completed: false },
      { id: 6, text: "Do laundry", completed: false },
      { id: 7, text: "Go for a run", completed: false },
      { id: 8, text: "Write a blog post", completed: false },
      { id: 9, text: "Call a friend", completed: false },
      { id: 10, text: "Organize workspace", completed: false },
      { id: 11, text: "Plan the week", completed: false },
      { id: 12, text: "Buy a birthday gift", completed: false },
      { id: 13, text: "Schedule a dentist appointment", completed: false },
      { id: 14, text: "Water the plants", completed: false },
      { id: 15, text: "Finish reading the novel", completed: false },
    ];

    if (tasks.length === 0) {
      setTasks(defaultTasks);
      localStorage.setItem("tasks", JSON.stringify(defaultTasks));
    }

  }, [tasks.length]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddTask = (task) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, task];
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  };

  const handleEditTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleDelete = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleCheckboxChange = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };


  const truncateTask = (text) => {
    if (text.length > maxChars) {
      return `${text.slice(0, maxChars)}...`;
    }
    return text;
  };

  return (
    <div className="todo-options" style={{ position: "relative" }}>
      <div className="settings-icon" onClick={handleOpenModal}>
        <i className="fas fa-cog"></i>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddTask}
        tasks={tasks}
        onDelete={handleDelete}
        onEdit={handleEditTask}
      />
      {tasks.length === 0 ? (
        <div
          className="text-[12px] h-[100%]"
          style={{
            textAlign: "center",
            margin: "20px",
            color: "#888",
            letterSpacing: "1px",
          }}
        >
          Your task list is empty! Add your first tasks.
        </div>
      ) : (
        
        <ul className="h-[100%] todo-list-container">
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{ display: "flex", alignItems: "center" }}
              className="mb-1"
            >
              <input
                type="checkbox"
                id={`task-${task.id}`}
                checked={task.completed || false}
                onChange={() => handleCheckboxChange(task.id)}
                style={{ display: "none" }}
              />
              <label
                htmlFor={`task-${task.id}`}
                className={`custom-checkbox ${task.completed ? "checked" : ""}`}
              >
                <i className="fas fa-check"></i>
              </label>
              <span
                style={{
                  letterSpacing: "1.5px",
                  textDecoration: task.completed ? "line-through" : "none",
                  marginLeft: "8px",
                }}
                className="text-gray-500 text-[11px] 2xl:text-[15px]"
              >
                {truncateTask(task.text)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
