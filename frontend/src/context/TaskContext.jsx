import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const TaskContext = createContext();

export const useTasks = () => {
	const context = useContext(TaskContext);
	if (!context) {
		throw new Error('useTasks must be used within a TaskProvider');
	}
	return context;
};

export const TaskProvider = ({ children }) => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [sortBy, setSortBy] = useState('priority'); // priority, date, name
	const [showCompleted, setShowCompleted] = useState(true);
	const [filterPriority, setFilterPriority] = useState('all'); // all, high, medium, low

	// Группировка задач по квадрантам
	const getTasksByQuadrant = (quadrant) => {
		return tasks.filter((task) => task.quadrant === quadrant);
	};

	// Получение всех задач с сервера
	const fetchTasks = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/tasks');
			if (response.ok) {
				const data = await response.json();
				setTasks(data);
			} else {
				throw new Error('Failed to fetch tasks');
			}
		} catch (error) {
			console.error('Error fetching tasks:', error);
			toast.error('Ошибка при загрузке задач');
		} finally {
			setLoading(false);
		}
	};

	// Создание новой задачи
	const createTask = async (taskData) => {
		try {
			const response = await fetch('/api/tasks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(taskData),
			});

			if (response.ok) {
				const newTask = await response.json();
				setTasks((prev) => [...prev, newTask]);
				toast.success('Задача создана');
				return newTask;
			} else {
				throw new Error('Failed to create task');
			}
		} catch (error) {
			console.error('Error creating task:', error);
			toast.error('Ошибка при создании задачи');
			throw error;
		}
	};

	// Обновление задачи
	const updateTask = async (taskId, updates) => {
		try {
			const response = await fetch(`/api/tasks/${taskId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updates),
			});

			if (response.ok) {
				const updatedTask = await response.json();
				setTasks((prev) =>
					prev.map((task) =>
						task.id === taskId ? updatedTask : task
					)
				);
				toast.success('Задача обновлена');
				return updatedTask;
			} else {
				throw new Error('Failed to update task');
			}
		} catch (error) {
			console.error('Error updating task:', error);
			toast.error('Ошибка при обновлении задачи');
			throw error;
		}
	};

	// Удаление задачи
	const deleteTask = async (taskId) => {
		try {
			const response = await fetch(`/api/tasks/${taskId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setTasks((prev) => prev.filter((task) => task.id !== taskId));
				toast.success('Задача удалена');
			} else {
				throw new Error('Failed to delete task');
			}
		} catch (error) {
			console.error('Error deleting task:', error);
			toast.error('Ошибка при удалении задачи');
		}
	};

	// Перемещение задачи между квадрантами
	const moveTask = async (taskId, newQuadrant) => {
		try {
			const response = await fetch(`/api/tasks/${taskId}/move`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ quadrant: newQuadrant }),
			});

			if (response.ok) {
				const updatedTask = await response.json();
				setTasks((prev) =>
					prev.map((task) =>
						task.id === taskId ? updatedTask : task
					)
				);
				toast.success('Задача перемещена');
				return updatedTask;
			} else {
				throw new Error('Failed to move task');
			}
		} catch (error) {
			console.error('Error moving task:', error);
			toast.error('Ошибка при перемещении задачи');
			throw error;
		}
	};

	// Экспорт задач в CSV
	const exportToCSV = async () => {
		try {
			const response = await fetch('/api/tasks/export', {
				method: 'GET',
			});

			if (response.ok) {
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'eisenhower-matrix-tasks.csv';
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
				toast.success('Задачи экспортированы в CSV');
			} else {
				throw new Error('Failed to export tasks');
			}
		} catch (error) {
			console.error('Error exporting tasks:', error);
			toast.error('Ошибка при экспорте задач');
		}
	};

	// Сортировка задач
	const getSortedTasks = (taskList) => {
		let sorted = [...taskList];

		if (!showCompleted) {
			sorted = sorted.filter((task) => !task.completed);
		}

		if (filterPriority !== 'all') {
			sorted = sorted.filter((task) => task.priority === filterPriority);
		}

		switch (sortBy) {
			case 'priority':
				const priorityOrder = { high: 3, medium: 2, low: 1 };
				sorted.sort(
					(a, b) =>
						priorityOrder[b.priority] - priorityOrder[a.priority]
				);
				break;
			case 'date':
				sorted.sort(
					(a, b) => new Date(a.dueDate) - new Date(b.dueDate)
				);
				break;
			case 'name':
				sorted.sort((a, b) => a.title.localeCompare(b.title));
				break;
			default:
				break;
		}

		return sorted;
	};

	// Загрузка задач при монтировании компонента
	useEffect(() => {
		fetchTasks();
	}, []);

	const value = {
		tasks,
		loading,
		sortBy,
		setSortBy,
		showCompleted,
		setShowCompleted,
		filterPriority,
		setFilterPriority,
		getTasksByQuadrant,
		createTask,
		updateTask,
		deleteTask,
		moveTask,
		exportToCSV,
		getSortedTasks,
		fetchTasks,
	};

	return (
		<TaskContext.Provider value={value}>{children}</TaskContext.Provider>
	);
};

