import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useTranslations } from '../context/I18nContext';

const TaskModal = () => {
	const { createTask } = useTasks();
	const { t } = useTranslations();
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		quadrant: 'urgent-important',
		priority: 'medium',
		dueDate: '',
		completed: false,
	});

	const quadrants = [
		{
			value: 'urgent-important',
			label: t('quadrants.urgentImportant.title'),
		},
		{
			value: 'important-not-urgent',
			label: t('quadrants.importantNotUrgent.title'),
		},
		{
			value: 'urgent-not-important',
			label: t('quadrants.urgentNotImportant.title'),
		},
		{
			value: 'not-urgent-not-important',
			label: t('quadrants.notUrgentNotImportant.title'),
		},
	];

	const priorities = [
		{ value: 'high', label: t('priorities.high') },
		{ value: 'medium', label: t('priorities.medium') },
		{ value: 'low', label: t('priorities.low') },
	];

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.title.trim()) {
			alert(t('modal.titleRequired'));
			return;
		}

		try {
			await createTask(formData);
			handleClose();
		} catch (error) {
			console.error('Error creating task:', error);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
		setFormData({
			title: '',
			description: '',
			quadrant: 'urgent-important',
			priority: 'medium',
			dueDate: '',
			completed: false,
		});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Открываем модальное окно при нажатии Ctrl+N
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.ctrlKey && e.key === 'n') {
				e.preventDefault();
				setIsOpen(true);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, []);

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
				{/* Заголовок */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
					<h2 className='text-xl font-bold'>
						{t('modal.createTask')}
					</h2>
					<button
						onClick={handleClose}
						className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
					>
						<X size={20} />
					</button>
				</div>

				{/* Форма */}
				<form
					onSubmit={handleSubmit}
					className='p-6 space-y-4'
				>
					{/* Название */}
					<div>
						<label className='block text-sm font-medium mb-2'>
							{t('task.title')} *
						</label>
						<input
							type='text'
							name='title'
							value={formData.title}
							onChange={handleChange}
							className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							placeholder={t('modal.titlePlaceholder')}
							required
						/>
					</div>

					{/* Описание */}
					<div>
						<label className='block text-sm font-medium mb-2'>
							{t('task.description')}
						</label>
						<textarea
							name='description'
							value={formData.description}
							onChange={handleChange}
							rows='3'
							className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
							placeholder={t('modal.descriptionPlaceholder')}
						/>
					</div>

					{/* Квадрант */}
					<div>
						<label className='block text-sm font-medium mb-2'>
							{t('task.quadrant')}
						</label>
						<select
							name='quadrant'
							value={formData.quadrant}
							onChange={handleChange}
							className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						>
							{quadrants.map((quadrant) => (
								<option
									key={quadrant.value}
									value={quadrant.value}
								>
									{quadrant.label}
								</option>
							))}
						</select>
					</div>

					{/* Приоритет */}
					<div>
						<label className='block text-sm font-medium mb-2'>
							{t('task.priority')}
						</label>
						<select
							name='priority'
							value={formData.priority}
							onChange={handleChange}
							className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						>
							{priorities.map((priority) => (
								<option
									key={priority.value}
									value={priority.value}
								>
									{priority.label}
								</option>
							))}
						</select>
					</div>

					{/* Дата выполнения */}
					<div>
						<label className='block text-sm font-medium mb-2'>
							{t('task.dueDate')}
						</label>
						<input
							type='date'
							name='dueDate'
							value={formData.dueDate}
							onChange={handleChange}
							className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
					</div>

					{/* Кнопки */}
					<div className='flex gap-3 pt-4'>
						<button
							type='submit'
							className='flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium'
						>
							{t('modal.createTask')}
						</button>
						<button
							type='button'
							onClick={handleClose}
							className='flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium'
						>
							{t('common.cancel')}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default TaskModal;
