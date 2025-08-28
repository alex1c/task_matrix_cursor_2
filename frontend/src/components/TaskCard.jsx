import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	Edit,
	Trash2,
	Calendar,
	Flag,
	CheckCircle,
	Circle,
	Move,
	ChevronDown,
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useTasks } from '../context/TaskContext';

const TaskCard = ({ task, index }) => {
	const { updateTask, deleteTask, moveTask } = useTasks();
	const [isEditing, setIsEditing] = useState(false);
	const [showMoveMenu, setShowMoveMenu] = useState(false);
	const menuRef = useRef(null);
	const [editData, setEditData] = useState({
		title: task.title,
		description: task.description || '',
		priority: task.priority,
		dueDate: task.dueDate || '',
	});

	// Закрытие меню при клике вне его
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setShowMoveMenu(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: task.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const priorityColors = {
		high: 'text-red-600',
		medium: 'text-yellow-600',
		low: 'text-green-600',
	};

	const priorityLabels = {
		high: 'Высокий',
		medium: 'Средний',
		low: 'Низкий',
	};

	const quadrantLabels = {
		'urgent-important': 'Важно и Срочно',
		'important-not-urgent': 'Важно, но не Срочно',
		'urgent-not-important': 'Срочно, но не Важно',
		'not-urgent-not-important': 'Не Важно и не Срочно',
	};

	const handleToggleComplete = async () => {
		try {
			await updateTask(task.id, { completed: !task.completed });
		} catch (error) {
			console.error('Error toggling task completion:', error);
		}
	};

	const handleSave = async () => {
		try {
			await updateTask(task.id, editData);
			setIsEditing(false);
		} catch (error) {
			console.error('Error updating task:', error);
		}
	};

	const handleDelete = async () => {
		if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
			try {
				await deleteTask(task.id);
			} catch (error) {
				console.error('Error deleting task:', error);
			}
		}
	};

	const handleMoveTask = async (newQuadrant) => {
		try {
			await moveTask(task.id, newQuadrant);
			setShowMoveMenu(false);
		} catch (error) {
			console.error('Error moving task:', error);
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return 'Без даты';
		try {
			return format(new Date(dateString), 'dd MMM', { locale: ru });
		} catch {
			return 'Неверная дата';
		}
	};

	if (isEditing) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className={`task-card bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 shadow-md border ${
					isDragging ? 'drag-preview' : ''
				} ${task.completed ? 'task-completed' : ''} priority-${
					task.priority
				}`}
			>
				<div className='space-y-3'>
					<input
						type='text'
						value={editData.title}
						onChange={(e) =>
							setEditData({
								...editData,
								title: e.target.value,
							})
						}
						className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700'
						placeholder='Название задачи'
					/>

					<textarea
						value={editData.description}
						onChange={(e) =>
							setEditData({
								...editData,
								description: e.target.value,
							})
						}
						className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 resize-none'
						placeholder='Описание (необязательно)'
						rows='2'
					/>

					<div className='flex gap-2'>
						<select
							value={editData.priority}
							onChange={(e) =>
								setEditData({
									...editData,
									priority: e.target.value,
								})
							}
							className='flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700'
						>
							<option value='high'>Высокий</option>
							<option value='medium'>Средний</option>
							<option value='low'>Низкий</option>
						</select>

						<input
							type='date'
							value={editData.dueDate}
							onChange={(e) =>
								setEditData({
									...editData,
									dueDate: e.target.value,
								})
							}
							className='flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700'
						/>
					</div>

					<div className='flex gap-2'>
						<button
							onClick={handleSave}
							className='flex-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors'
						>
							Сохранить
						</button>
						<button
							onClick={() => setIsEditing(false)}
							className='flex-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors'
						>
							Отмена
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			className={`task-card bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 shadow-md border transition-all duration-200 hover:shadow-lg cursor-grab active:cursor-grabbing touch-manipulation ${
				isDragging ? 'drag-preview' : ''
			} ${task.completed ? 'task-completed' : ''} priority-${
				task.priority
			}`}
			style={{
				...style,
				touchAction: 'none', // Важно для мобильных устройств
			}}
		>
			{/* Заголовок и кнопки */}
			<div className='flex items-start justify-between mb-2'>
				<div className='flex items-center gap-2 flex-1'>
					<button
						onClick={handleToggleComplete}
						className='flex-shrink-0'
						title={
							task.completed
								? 'Отметить как невыполненную'
								: 'Отметить как выполненную'
						}
					>
						{task.completed ? (
							<CheckCircle
								size={16}
								className='text-green-500'
							/>
						) : (
							<Circle
								size={16}
								className='text-gray-400'
							/>
						)}
					</button>

					<h4 className='font-medium text-sm flex-1 line-clamp-2'>
						{task.title}
					</h4>
				</div>

				<div className='flex items-center gap-1 flex-shrink-0'>
					{/* Мобильное меню перемещения */}
					<div
						className='relative md:hidden'
						ref={menuRef}
					>
						<button
							onClick={() => setShowMoveMenu(!showMoveMenu)}
							className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
							title='Переместить'
						>
							<Move size={12} />
						</button>

						{showMoveMenu && (
							<div className='absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-48'>
								<div className='p-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700'>
									Переместить в:
								</div>
								{Object.entries(quadrantLabels).map(
									([quadrantId, label]) =>
										quadrantId !== task.quadrant && (
											<button
												key={quadrantId}
												onClick={() =>
													handleMoveTask(quadrantId)
												}
												className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
											>
												{label}
											</button>
										)
								)}
							</div>
						)}
					</div>

					<button
						onClick={() => setIsEditing(true)}
						className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
						title='Редактировать'
					>
						<Edit size={12} />
					</button>
					<button
						onClick={handleDelete}
						className='p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors'
						title='Удалить'
					>
						<Trash2
							size={12}
							className='text-red-500'
						/>
					</button>
				</div>
			</div>

			{/* Описание */}
			{task.description && (
				<p className='text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2'>
					{task.description}
				</p>
			)}

			{/* Метаданные */}
			<div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
				<div className='flex items-center gap-2'>
					<div className='flex items-center gap-1'>
						<Flag
							size={10}
							className={priorityColors[task.priority]}
						/>
						<span className={priorityColors[task.priority]}>
							{priorityLabels[task.priority]}
						</span>
					</div>

					{task.dueDate && (
						<div className='flex items-center gap-1'>
							<Calendar size={10} />
							<span>{formatDate(task.dueDate)}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TaskCard;
