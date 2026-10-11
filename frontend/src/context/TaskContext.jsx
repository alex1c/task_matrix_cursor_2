import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { apiFetch } from '../api'

const TaskContext = createContext()

export const useTasks = () => {
	const context = useContext(TaskContext)
	if (!context) {
		throw new Error('useTasks must be used within a TaskProvider')
	}
	return context
}

export const TaskProvider = ({ children }) => {
	const [tasks, setTasks] = useState([])
	const [loading, setLoading] = useState(true)
	const [sortBy, setSortBy] = useState('priority') // priority, date, name
	const [filterStatus, setFilterStatus] = useState('incomplete') // all, completed, incomplete
	const [filterPriority, setFilterPriority] = useState('all') // all, high, medium, low

	// Group tasks by Eisenhower quadrant.
	const getTasksByQuadrant = (quadrant) => {
		return tasks.filter((task) => task.quadrant === quadrant)
	}

	const fetchTasks = async () => {
		try {
			setLoading(true)
			const response = await apiFetch('/api/tasks')
			if (response.ok) {
				const data = await response.json()
				const transformedData = data.map((task) => ({
					...task,
					dueDate: task.due_date,
				}))
				setTasks(transformedData)
			} else {
				throw new Error('Failed to fetch tasks')
			}
		} catch (error) {
			toast.error('Ошибка при загрузке задач')
		} finally {
			setLoading(false)
		}
	}

	const createTask = async (taskData) => {
		try {
			const response = await apiFetch('/api/tasks', {
				method: 'POST',
				body: JSON.stringify(taskData),
			})

			if (response.ok) {
				const newTask = await response.json()
				const transformedTask = {
					...newTask,
					dueDate: newTask.due_date,
				}
				setTasks((prev) => [...prev, transformedTask])
				toast.success('Задача создана')
				return transformedTask
			} else {
				throw new Error('Failed to create task')
			}
		} catch (error) {
			toast.error('Ошибка при создании задачи')
			throw error
		}
	}

	const updateTask = async (taskId, updates) => {
		try {
			const response = await apiFetch(`/api/tasks/${taskId}`, {
				method: 'PUT',
				body: JSON.stringify(updates),
			})

			if (response.ok) {
				const updatedTask = await response.json()
				const transformedTask = {
					...updatedTask,
					dueDate: updatedTask.due_date,
				}
				setTasks((prev) =>
					prev.map((task) =>
						task.id === taskId ? transformedTask : task
					)
				)
				toast.success('Задача обновлена')
				return transformedTask
			} else {
				throw new Error('Failed to update task')
			}
		} catch (error) {
			toast.error('Ошибка при обновлении задачи')
			throw error
		}
	}

	const deleteTask = async (taskId) => {
		try {
			const response = await apiFetch(`/api/tasks/${taskId}`, {
				method: 'DELETE',
			})

			if (response.ok) {
				setTasks((prev) => prev.filter((task) => task.id !== taskId))
				toast.success('Задача удалена')
			} else {
				throw new Error('Failed to delete task')
			}
		} catch (error) {
			toast.error('Ошибка при удалении задачи')
		}
	}

	const moveTask = async (taskId, newQuadrant) => {
		try {
			const response = await apiFetch(`/api/tasks/${taskId}/move`, {
				method: 'PUT',
				body: JSON.stringify({ quadrant: newQuadrant }),
			})

			if (response.ok) {
				const updatedTask = await response.json()
				const transformedTask = {
					...updatedTask,
					dueDate: updatedTask.due_date,
				}
				setTasks((prev) =>
					prev.map((task) =>
						task.id === taskId ? transformedTask : task
					)
				)
				toast.success('Задача перемещена')
				return transformedTask
			} else {
				throw new Error('Failed to move task')
			}
		} catch (error) {
			toast.error('Ошибка при перемещении задачи')
			throw error
		}
	}

	const exportToCSV = async () => {
		try {
			const response = await apiFetch('/api/tasks/export', {
				method: 'GET',
				headers: {
					Accept: 'text/csv; charset=utf-8',
				},
			})

			if (response.ok) {
				const blob = await response.blob()
				const url = window.URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.href = url
				a.download = 'eisenhower-matrix-tasks.csv'
				document.body.appendChild(a)
				a.click()
				window.URL.revokeObjectURL(url)
				document.body.removeChild(a)
				toast.success('Задачи экспортированы в CSV')
			} else {
				throw new Error('Failed to export tasks')
			}
		} catch (error) {
			toast.error('Ошибка при экспорте задач')
		}
	}

	const getSortedTasks = (taskList) => {
		try {
			if (!Array.isArray(taskList)) {
				return []
			}

			let sorted = [...taskList].filter((task) => task && task.id)

			switch (filterStatus) {
				case 'completed':
					sorted = sorted.filter((task) => task.completed)
					break
				case 'incomplete':
					sorted = sorted.filter((task) => !task.completed)
					break
				case 'all':
				default:
					break
			}

			if (filterPriority !== 'all') {
				sorted = sorted.filter(
					(task) => task.priority === filterPriority
				)
			}

			switch (sortBy) {
				case 'priority': {
					const priorityOrder = { high: 3, medium: 2, low: 1 }
					sorted.sort(
						(a, b) =>
							(priorityOrder[b.priority] || 0) -
							(priorityOrder[a.priority] || 0)
					)
					break
				}
				case 'date':
					sorted.sort((a, b) => {
						const dateA = a.dueDate
							? new Date(a.dueDate)
							: new Date('9999-12-31')
						const dateB = b.dueDate
							? new Date(b.dueDate)
							: new Date('9999-12-31')
						return dateA - dateB
					})
					break
				case 'name':
					sorted.sort((a, b) => {
						const titleA = a.title || ''
						const titleB = b.title || ''
						return titleA.localeCompare(titleB)
					})
					break
				default:
					break
			}

			return sorted
		} catch (error) {
			return taskList || []
		}
	}

	useEffect(() => {
		fetchTasks()
	}, [])

	const value = {
		tasks,
		loading,
		sortBy,
		setSortBy,
		filterStatus,
		setFilterStatus,
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
	}

	return (
		<TaskContext.Provider value={value}>{children}</TaskContext.Provider>
	)
}
