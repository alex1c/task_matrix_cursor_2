import React from 'react';
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from 'recharts';
import { useTasks } from '../context/TaskContext';
import { useTranslations } from '../context/I18nContext';

const Statistics = () => {
	const { tasks } = useTasks();
	const { t } = useTranslations();

	// Подсчет задач по квадрантам
	const quadrantStats = [
		{
			name: t('quadrants.urgentImportant.title'),
			value: tasks.filter((task) => task.quadrant === 'urgent-important')
				.length,
			color: '#ef4444',
		},
		{
			name: t('quadrants.importantNotUrgent.title'),
			value: tasks.filter(
				(task) => task.quadrant === 'important-not-urgent'
			).length,
			color: '#f59e0b',
		},
		{
			name: t('quadrants.urgentNotImportant.title'),
			value: tasks.filter(
				(task) => task.quadrant === 'urgent-not-important'
			).length,
			color: '#eab308',
		},
		{
			name: t('quadrants.notUrgentNotImportant.title'),
			value: tasks.filter(
				(task) => task.quadrant === 'not-urgent-not-important'
			).length,
			color: '#6b7280',
		},
	];

	const totalTasks = tasks.length;
	const completedTasks = tasks.filter((task) => task.completed).length;
	const completionRate =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	return (
		<div className='mt-12'>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{/* Круговая диаграмма */}
				<div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md'>
					<h3 className='text-xl font-bold mb-4 text-center'>
						{t('statistics.chartTitle')}
					</h3>

					{totalTasks > 0 ? (
						<div className='h-64'>
							<ResponsiveContainer
								width='100%'
								height='100%'
							>
								<PieChart>
									<Pie
										data={quadrantStats}
										cx='50%'
										cy='50%'
										innerRadius={60}
										outerRadius={100}
										paddingAngle={5}
										dataKey='value'
									>
										{quadrantStats.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={entry.color}
											/>
										))}
									</Pie>
									<Tooltip
										formatter={(value, name) => [
											value,
											name,
										]}
										labelStyle={{ color: '#374151' }}
									/>
									<Legend
										verticalAlign='bottom'
										height={36}
										formatter={(value, entry) => (
											<span style={{ color: '#6b7280' }}>
												{value} ({entry.payload.value})
											</span>
										)}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
					) : (
						<div className='h-64 flex items-center justify-center text-gray-500'>
							<p>{t('statistics.noTasksToDisplay')}</p>
						</div>
					)}

					{/* Статистика */}
					<div className='mt-6 grid grid-cols-2 gap-4 text-center'>
						<div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3'>
							<div className='text-2xl font-bold text-blue-600'>
								{totalTasks}
							</div>
							<div className='text-sm text-gray-600 dark:text-gray-400'>
								{t('statistics.totalTasks')}
							</div>
						</div>
						<div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3'>
							<div className='text-2xl font-bold text-green-600'>
								{completionRate}%
							</div>
							<div className='text-sm text-gray-600 dark:text-gray-400'>
								{t('statistics.completed')}
							</div>
						</div>
					</div>
				</div>

				{/* Описание матрицы Эйзенхауэра */}
				<div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md'>
					<h3 className='text-xl font-bold mb-4'>
						{t('statistics.whatIsEisenhowerMatrix')}
					</h3>

					<div className='space-y-4 text-sm leading-relaxed'>
						<p>
							<strong>{t('statistics.eisenhowerMatrix')}</strong>{' '}
							— {t('statistics.description')}
						</p>

						<div className='space-y-3'>
							<div className='border-l-4 border-red-500 pl-4'>
								<h4 className='font-semibold text-red-700 dark:text-red-400'>
									🔥 {t('quadrants.urgentImportant.title')}
								</h4>
								<p className='text-gray-600 dark:text-gray-400'>
									{t('statistics.urgentImportantDesc')}
								</p>
							</div>

							<div className='border-l-4 border-orange-500 pl-4'>
								<h4 className='font-semibold text-orange-700 dark:text-orange-400'>
									📅 {t('quadrants.importantNotUrgent.title')}
								</h4>
								<p className='text-gray-600 dark:text-gray-400'>
									{t('statistics.importantNotUrgentDesc')}
								</p>
							</div>

							<div className='border-l-4 border-yellow-500 pl-4'>
								<h4 className='font-semibold text-yellow-700 dark:text-yellow-400'>
									⚡ {t('quadrants.urgentNotImportant.title')}
								</h4>
								<p className='text-gray-600 dark:text-gray-400'>
									{t('statistics.urgentNotImportantDesc')}
								</p>
							</div>

							<div className='border-l-4 border-gray-500 pl-4'>
								<h4 className='font-semibold text-gray-700 dark:text-gray-400'>
									🗑️{' '}
									{t('quadrants.notUrgentNotImportant.title')}
								</h4>
								<p className='text-gray-600 dark:text-gray-400'>
									{t('statistics.notUrgentNotImportantDesc')}
								</p>
							</div>
						</div>

						<div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
							<h4 className='font-semibold text-blue-800 dark:text-blue-300 mb-2'>
								💡 {t('statistics.usageTip')}
							</h4>
							<p className='text-blue-700 dark:text-blue-400 text-sm'>
								{t('statistics.usageTipText')}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Statistics;
