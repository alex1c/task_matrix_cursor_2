import React, { useMemo } from 'react';
import {
	DndContext,
	DragOverlay,
	useSensors,
	useSensor,
	PointerSensor,
	TouchSensor,
	KeyboardSensor,
	closestCenter,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Quadrant from './Quadrant';
import { useTasks } from '../context/TaskContext';
import { useTranslations } from '../context/I18nContext';

const Matrix = () => {
	const { tasks, moveTask, getSortedTasks } = useTasks();
	const { t } = useTranslations();
	const [activeId, setActiveId] = React.useState(null);
	const [isDragging, setIsDragging] = React.useState(false);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		}),
		useSensor(KeyboardSensor)
	);

	const quadrants = [
		{
			id: 'urgent-important',
			title: t('quadrants.urgentImportant.title'),
			subtitle: t('quadrants.urgentImportant.subtitle'),
			color: 'quadrant-urgent-important',
			icon: '🔥',
		},
		{
			id: 'important-not-urgent',
			title: t('quadrants.importantNotUrgent.title'),
			subtitle: t('quadrants.importantNotUrgent.subtitle'),
			color: 'quadrant-important-not-urgent',
			icon: '📅',
		},
		{
			id: 'urgent-not-important',
			title: t('quadrants.urgentNotImportant.title'),
			subtitle: t('quadrants.urgentNotImportant.subtitle'),
			color: 'quadrant-urgent-not-important',
			icon: '⚡',
		},
		{
			id: 'not-urgent-not-important',
			title: t('quadrants.notUrgentNotImportant.title'),
			subtitle: t('quadrants.notUrgentNotImportant.subtitle'),
			color: 'quadrant-not-urgent-not-important',
			icon: '🗑️',
		},
	];

	const handleDragStart = (event) => {
		setActiveId(event.active.id);
		setIsDragging(true);
	};

	const handleDragEnd = async (event) => {
		const { active, over } = event;
		setActiveId(null);
		setIsDragging(false);

		if (!over) return;

		// Проверяем, перетаскиваем ли мы задачу над квадрантом
		if (over.id.startsWith('quadrant-')) {
			const targetQuadrant = over.id.replace('quadrant-', '');
			const activeTask = tasks.find((task) => task.id === active.id);

			if (activeTask && activeTask.quadrant !== targetQuadrant) {
				try {
					await moveTask(active.id, targetQuadrant);
				} catch (error) {}
			}
		}
	};

	const handleDragOver = async (event) => {
		const { active, over } = event;

		if (!over) return;

		// Проверяем, перетаскиваем ли мы задачу над квадрантом
		if (over.id.startsWith('quadrant-')) {
			const targetQuadrant = over.id.replace('quadrant-', '');
			const activeTask = tasks.find((task) => task.id === active.id);

			if (activeTask && activeTask.quadrant !== targetQuadrant) {
				try {
					await moveTask(active.id, targetQuadrant);
				} catch (error) {}
			}
		}
	};

	return (
		<div className='mb-8'>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
			>
				<div className='matrix-grid grid gap-6 lg:gap-8'>
					{quadrants.map((quadrant) => {
						// Используем useMemo для стабилизации списка задач
						const quadrantTasks = useMemo(() => {
							try {
								const rawTasks = tasks.filter(
									(task) =>
										task &&
										task.id &&
										task.quadrant === quadrant.id
								);

								// Применяем сортировку только если не происходит перетаскивание
								if (isDragging) {
									return rawTasks;
								}

								// Безопасное применение сортировки
								const sortedTasks = getSortedTasks(rawTasks);
								return Array.isArray(sortedTasks)
									? sortedTasks
									: rawTasks;
							} catch (error) {
								return [];
							}
						}, [tasks, quadrant.id, isDragging, getSortedTasks]);

						// Создаем стабильные ключи для SortableContext
						const stableItems = useMemo(() => {
							return quadrantTasks
								.map((task) => task.id)
								.filter(Boolean)
								.sort();
						}, [quadrantTasks]);

						return (
							<SortableContext
								key={quadrant.id}
								items={stableItems}
								strategy={verticalListSortingStrategy}
							>
								<Quadrant
									id={quadrant.id}
									title={quadrant.title}
									subtitle={quadrant.subtitle}
									color={quadrant.color}
									icon={quadrant.icon}
									tasks={quadrantTasks}
									isDragging={isDragging}
								/>
							</SortableContext>
						);
					})}
				</div>
				<DragOverlay>
					{activeId ? (
						<div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-large border opacity-90 transform rotate-3 scale-105'>
							<div className='font-semibold text-sm'>
								{
									tasks.find((task) => task.id === activeId)
										?.title
								}
							</div>
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
};

export default Matrix;
