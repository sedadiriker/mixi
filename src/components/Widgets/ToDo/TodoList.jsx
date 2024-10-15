import React, { useState, useEffect } from 'react';
import './Todo.css'; 
import Modal from './Modal-todo';
import Swal from 'sweetalert2';

const TodoList = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (!Array.isArray(savedTasks)) {
      console.error('Tasks is not an array:', savedTasks);
      return [];
    }
    return savedTasks;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const tasksPerSlide = 5;
  const maxChars = 20;

  useEffect(() => {
    // Varsayılan görevler
    const defaultTasks = [
      { id: 1, text: 'Buy groceries', completed: false },
      { id: 2, text: 'Walk the dog', completed: false },
      { id: 3, text: 'Read a book', completed: false },
      { id: 4, text: 'Prepare dinner', completed: false },
      { id: 5, text: 'Complete homework', completed: false },
    ];

    // Eğer görev listesi boşsa, varsayılan görevleri ekle
    if (tasks.length === 0) {
      setTasks(defaultTasks);
      localStorage.setItem('tasks', JSON.stringify(defaultTasks)); // Varsayılan görevleri localStorage'a kaydet
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + tasksPerSlide;
        return nextIndex < tasks.length ? nextIndex : 0; 
      });
    }, 10000); 

    return () => clearInterval(interval); 
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
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); 
      return updatedTasks; 
    });
  };

  const handleEditTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); 
  };

  const handleDelete = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); 
  };

  const handleCheckboxChange = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); 
  };

  const currentTasks = tasks.slice(currentIndex, currentIndex + tasksPerSlide);

  const truncateTask = (text) => {
    if (text.length > maxChars) {
      return `${text.slice(0, maxChars)}...`; 
    }
    return text; 
  };

  return (
    <div className="todo-options" style={{ position: 'relative' }}>
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
        <div className="text-[12px]" style={{ textAlign: 'center', margin: '20px', color: '#888', letterSpacing:"1px" }}>
          Your task list is empty! Add your first tasks.
        </div>
      ) : (
        <ul>
          {currentTasks.map((task) => (
            <li key={task.id} style={{ display: 'flex', alignItems: 'center' }} className="mb-1">
              <input 
                type="checkbox" 
                id={`task-${task.id}`} 
                checked={task.completed || false} 
                onChange={() => handleCheckboxChange(task.id)} 
                style={{ display: 'none' }} 
              />
              <label 
                htmlFor={`task-${task.id}`} 
                className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
              >  
                <i className="fas fa-check"></i>
              </label>
              <span style={{ letterSpacing: "1.5px", textDecoration: task.completed ? 'line-through' : 'none', marginLeft: '8px' }} className="text-gray-500 text-[11px]">
                {truncateTask(task.text)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
