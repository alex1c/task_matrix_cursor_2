import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const Quadrant = ({ id, title, subtitle, color, icon, tasks }) => {
	const { createTask } = useTasks();
	const { setNodeRef, isOver } = useDroppable({
		id: `quadrant-${id}`,
	});

	const handleAddTask = () => {
		createTask({
			title: 'Новая задача',
			description: '',
			quadrant: id,
			priority: 'medium',
			dueDate: new Date().toISOString().split('T')[0],
			completed: false,
		});
	};

	return (
		<div
			ref={setNodeRef}
			className={`quadrant ${color} rounded-2xl border-2 p-6 min-h-[350px] transition-all duration-300 hover:shadow-large ${
				isOver ? 'drop-zone-active' : ''
			}`}
		>
			{/* Заголовок квадранта */}
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center gap-3'>
					<span className='text-3xl'>{icon}</span>
					<div>
						<h3 className='font-bold text-xl leading-tight text-gray-900 dark:text-gray-100'>
							{title}
						</h3>
						<p className='text-sm opacity-75 font-medium text-gray-700 dark:text-gray-300'>
							{subtitle}
						</p>
					</div>
				</div>
				<button
					onClick={handleAddTask}
					className='p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-soft hover:shadow-medium hover:scale-110'
					title='Добавить задачу'
				>
					<Plus
						size={18}
						className='text-primary-600'
					/>
				</button>
			</div>

			{/* Счетчик задач */}
			<div className='text-sm opacity-75 mb-4 font-medium text-gray-700 dark:text-gray-300'>
				{tasks.length}{' '}
				{tasks.length === 1
					? 'задача'
					: tasks.length < 5
					? 'задачи'
					: 'задач'}
			</div>

			{/* Зона для задач */}
			<div className='min-h-[220px] transition-all duration-300'>
				{tasks.length === 0 ? (
					<div className='flex items-center justify-center h-36 text-center opacity-60'>
						<div>
							<p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
								Нет задач
							</p>
							<p className='text-xs mt-1 text-gray-500 dark:text-gray-500'>
								Перетащите задачу сюда или создайте новую
							</p>
						</div>
					</div>
				) : (
					tasks.map((task, index) => (
						<TaskCard
							key={task.id}
							task={task}
							index={index}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default Quadrant;
