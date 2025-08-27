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

const Statistics = () => {
	const { tasks } = useTasks();

	// Подсчет задач по квадрантам
	const quadrantStats = [
		{
			name: 'Важно и Срочно',
			value: tasks.filter((task) => task.quadrant === 'urgent-important')
				.length,
			color: '#ef4444',
		},
		{
			name: 'Важно, но не Срочно',
			value: tasks.filter(
				(task) => task.quadrant === 'important-not-urgent'
			).length,
			color: '#f59e0b',
		},
		{
			name: 'Срочно, но не Важно',
			value: tasks.filter(
				(task) => task.quadrant === 'urgent-not-important'
			).length,
			color: '#eab308',
		},
		{
			name: 'Не Важно и не Срочно',
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
						Куда уходит время
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
							<p>Нет задач для отображения</p>
						</div>
					)}

					{/* Статистика */}
					<div className='mt-6 grid grid-cols-2 gap-4 text-center'>
						<div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3'>
							<div className='text-2xl font-bold text-blue-600'>
								{totalTasks}
							</div>
							<div className='text-sm text-gray-600 dark:text-gray-400'>
								Всего задач
							</div>
						</div>
						<div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3'>
							<div className='text-2xl font-bold text-green-600'>
								{completionRate}%
							</div>
							<div className='text-sm text-gray-600 dark:text-gray-400'>
								Выполнено
							</div>
						</div>
					</div>
				</div>

				{/* Описание матрицы Эйзенхауэра */}
				<div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md'>
					<h3 className='text-xl font-bold mb-4'>
						Что такое матрица Эйзенхауэра?
					</h3>

					<div className='space-y-4 text-sm leading-relaxed'>
						<p>
							<strong>Матрица Эйзенхауэра</strong> — это
							инструмент для приоритизации задач, разработанный
							34-м президентом США Дуайтом Эйзенхауэром. Она
							помогает организовать задачи по важности и
							срочности.
						</p>

						<div className='space-y-3'>
							<div className='border-l-4 border-red-500 pl-4'>
								<h4 className='font-semibold text-red-700 dark:text-red-400'>
									🔥 Важно и Срочно
								</h4>
								<p className='text-gray-600 dark:text-gray-400'>
									Кризисы, срочные проблемы, дедлайны.
									Выполняйте немедленно.
								</p>
							</div>

							<div className='border-l-4 border-orange-500 pl-4'>
								<h4 className='font-semibold text-orange-700 dark:text-orange-400'>
									📅 Важно, но не Срочно
								</h4>
								<p className='text-gray-600 dark:text-gray-400'>
									Планирование, развитие, отношения.
									Запланируйте время для выполнения.
								</p>
							</div>

							<div className='border-l-4 border-yellow-500 pl-4'>
								<h4 className='font-semibold text-yellow-700 dark:text-yellow-400'>
									⚡ Срочно, но не Важно
								</h4>
								<p className='text-gray-600 dark:text-gray-400'>
									Отвлечения, некоторые звонки, встречи.
									Делегируйте или минимизируйте.
								</p>
							</div>

							<div className='border-l-4 border-gray-500 pl-4'>
								<h4 className='font-semibold text-gray-700 dark:text-gray-400'>
									🗑️ Не Важно и не Срочно
								</h4>
								<p className='text-gray-600 dark:text-gray-400'>
									Пустая трата времени, отвлекающие факторы.
									Удалите или отложите.
								</p>
							</div>
						</div>

						<div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
							<h4 className='font-semibold text-blue-800 dark:text-blue-300 mb-2'>
								💡 Совет по использованию
							</h4>
							<p className='text-blue-700 dark:text-blue-400 text-sm'>
								Старайтесь проводить больше времени в квадранте
								"Важно, но не Срочно". Это поможет предотвратить
								появление задач в квадранте "Важно и Срочно".
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Statistics;

