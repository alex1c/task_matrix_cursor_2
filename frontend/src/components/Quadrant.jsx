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
			className={`quadrant ${color} rounded-lg border-2 p-4 min-h-[300px] transition-all duration-200 hover:shadow-lg ${
				isOver ? 'drop-zone-active' : ''
			}`}
		>
			{/* Заголовок квадранта */}
			<div className='flex items-center justify-between mb-4'>
				<div className='flex items-center gap-2'>
					<span className='text-2xl'>{icon}</span>
					<div>
						<h3 className='font-bold text-lg'>{title}</h3>
						<p className='text-sm opacity-75'>{subtitle}</p>
					</div>
				</div>
				<button
					onClick={handleAddTask}
					className='p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-sm'
					title='Добавить задачу'
				>
					<Plus size={16} />
				</button>
			</div>

			{/* Счетчик задач */}
			<div className='text-sm opacity-75 mb-3'>
				{tasks.length}{' '}
				{tasks.length === 1
					? 'задача'
					: tasks.length < 5
					? 'задачи'
					: 'задач'}
			</div>

			{/* Зона для задач */}
			<div className='min-h-[200px] transition-all duration-200'>
				{tasks.length === 0 ? (
					<div className='flex items-center justify-center h-32 text-center opacity-50'>
						<div>
							<p className='text-sm'>Нет задач</p>
							<p className='text-xs'>
								Перетащите задачу сюда или создайте
								новую
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
