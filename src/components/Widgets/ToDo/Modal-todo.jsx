import React, { useState, useEffect } from 'react';
import './Modal.css';
import { toastSuccessNotify, toastErrorNotify, toastWarnNotify } from '../../../helper/ToastNotify'; 

const Modal = ({ isOpen, onClose, onSubmit, tasks, onDelete, onEdit }) => {
  const [taskInput, setTaskInput] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    if (editingTaskId) {
      const taskToEdit = tasks.find((task) => task.id === editingTaskId);
      if (taskToEdit) {
        setTaskInput(taskToEdit.text); 
      }
    }
  }, [editingTaskId, tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskInput.trim()) {
      if (editingTaskId) {
        const updatedTask = {
          id: editingTaskId,
          text: taskInput,
        };
        onEdit(updatedTask); 
        toastSuccessNotify('Task updated successfully!');
        setEditingTaskId(null); 
      } else {
        // Yeni görev ekleme
        const newTask = {
          id: Date.now(),
          text: taskInput,
        };
        onSubmit(newTask); // Yeni görevi üst bileşene gönder
        toastSuccessNotify('Task added successfully!'); // Yeni görev ekleme bildirimi
      }
      setTaskInput(''); // Input alanını temizle
    } else {
      toastErrorNotify('Task cannot be empty!'); // Boş görev hatası
    }
  };

  const handleEditClick = (taskId) => {
    setEditingTaskId(taskId); // Düzenlenecek görevin ID'sini ayarla
  };

  const handleDeleteClick = (taskId) => {
    // Kullanıcıdan onay iste
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      onDelete(taskId); // Görevi sil
      toastWarnNotify('Task deleted successfully!'); // Silme bildirimi
    }
  };

  return (
    isOpen && (
      <div className="modal-overlay-todo">
        <div className="modal-content-todo">
          <h2 className="text-center uppercase" style={{ letterSpacing: "2px" }}>To Do List</h2>
          <form className="mt-3 flex flex-col" onSubmit={handleSubmit}>
            <input
              className="pl-2 py-2 rounded w-[90%] m-auto text-black todo-input text-[13px]"
              type="text"
              id="taskInput"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder={editingTaskId ? "Edit Task..." : "Add New Task..."}
            />
            <button className="bg-gray-800 w-[30%] m-auto my-3 rounded hover:opacity-45 text-white uppercase" type="submit">
              {editingTaskId ? "Save" : "Add"}
            </button>
          </form>
          <ul id="taskList" className="mt-2 w-[100%] bg-black rounded">
            {tasks.length === 0 ? (
              <li style={{ letterSpacing: "2px" }} className="my-1 py-2 text-center text-gray-500 text-[12px]"> Your task list is empty! Add your first tasks.
              </li>
            ) : (
              tasks.map(task => (
                <li key={task.id} className="my-1 py-2 flex justify-between px-3 text-[13px]" style={{ border: "1px solid rgba(255, 255, 255, 0.20)" }}>
                  <div>{task.text}</div>
                  <div className="flex gap-1">
                    <span onClick={() => handleEditClick(task.id)} className="icon cursor-pointer">✏️</span>
                    <span onClick={() => handleDeleteClick(task.id)} className="icon cursor-pointer">🗑️</span>
                  </div>
                </li>
              ))
            )}
          </ul>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
      </div>
    )
  );
};

export default Modal;
