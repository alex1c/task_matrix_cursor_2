import React, { useState } from 'react';
import {
	Sun,
	Moon,
	Monitor,
	Zap,
	Palette,
	Download,
	Filter,
	Eye,
	EyeOff,
	SortAsc,
	SortDesc,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';

const Header = () => {
	const { theme, isDark, toggleDarkMode, changeTheme } = useTheme();
	const {
		sortBy,
		setSortBy,
		showCompleted,
		setShowCompleted,
		filterPriority,
		setFilterPriority,
		exportToCSV,
	} = useTasks();

	const [showFilters, setShowFilters] = useState(false);

	const themes = [
		{ id: 'standard', name: 'Стандартная', icon: Monitor },
		{ id: 'retro', name: 'Ретро', icon: Palette },
		{ id: 'neon', name: 'Неон', icon: Zap },
	];

	const sortOptions = [
		{ value: 'priority', label: 'По приоритету' },
		{ value: 'date', label: 'По дате' },
		{ value: 'name', label: 'По названию' },
	];

	const priorityOptions = [
		{ value: 'all', label: 'Все приоритеты' },
		{ value: 'high', label: 'Высокий' },
		{ value: 'medium', label: 'Средний' },
		{ value: 'low', label: 'Низкий' },
	];

	return (
		<header className='mb-8'>
			<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
				{/* Заголовок */}
				<div className='text-center lg:text-left'>
					<h1 className='text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 bg-clip-text text-transparent leading-tight'>
						Матрица Эйзенхауэра
					</h1>
					<p className='text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium'>
						Управляйте своими задачами эффективно
					</p>
				</div>

				{/* Контролы */}
				<div className='flex flex-wrap items-center justify-center lg:justify-end gap-3'>
					{/* Переключатель темной темы */}
					<button
						onClick={toggleDarkMode}
						className='p-3 rounded-xl bg-white dark:bg-gray-800 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700'
						title={
							isDark
								? 'Переключить на светлую тему'
								: 'Переключить на темную тему'
						}
					>
						{isDark ? (
							<Sun
								size={20}
								className='text-amber-500'
							/>
						) : (
							<Moon
								size={20}
								className='text-slate-600'
							/>
						)}
					</button>

					{/* Выбор стиля темы */}
					<div className='relative'>
						<select
							value={theme}
							onChange={(e) => changeTheme(e.target.value)}
							className='p-3 rounded-xl bg-white dark:bg-gray-800 shadow-soft hover:shadow-medium transition-all duration-300 appearance-none pr-10 cursor-pointer border border-gray-200 dark:border-gray-700 font-medium'
						>
							{themes.map((themeOption) => {
								const Icon = themeOption.icon;
								return (
									<option
										key={themeOption.id}
										value={themeOption.id}
									>
										{themeOption.name}
									</option>
								);
							})}
						</select>
						<Palette
							size={16}
							className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-primary-500'
						/>
					</div>

					{/* Фильтры и сортировка */}
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`p-3 rounded-xl bg-white dark:bg-gray-800 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700 ${
							showFilters
								? 'ring-2 ring-primary-500 ring-opacity-50'
								: ''
						}`}
						title='Фильтры и сортировка'
					>
						<Filter
							size={20}
							className='text-primary-600'
						/>
					</button>

					{/* Экспорт */}
					<button
						onClick={exportToCSV}
						className='p-3 rounded-xl bg-white dark:bg-gray-800 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700'
						title='Экспорт в CSV'
					>
						<Download
							size={20}
							className='text-green-600'
						/>
					</button>
				</div>
			</div>

			{/* Панель фильтров */}
			{showFilters && (
				<div className='mt-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-medium animate-fade-in border border-gray-200 dark:border-gray-700'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{/* Сортировка */}
						<div>
							<label className='block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300'>
								Сортировка
							</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-soft focus:shadow-medium transition-all duration-200 font-medium'
							>
								{sortOptions.map((option) => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</select>
						</div>

						{/* Фильтр по приоритету */}
						<div>
							<label className='block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300'>
								Приоритет
							</label>
							<select
								value={filterPriority}
								onChange={(e) =>
									setFilterPriority(e.target.value)
								}
								className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-soft focus:shadow-medium transition-all duration-200 font-medium'
							>
								{priorityOptions.map((option) => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</select>
						</div>

						{/* Показать/скрыть выполненные */}
						<div className='flex items-end'>
							<button
								onClick={() => setShowCompleted(!showCompleted)}
								className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-soft hover:shadow-medium ${
									showCompleted
										? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
										: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
								}`}
							>
								{showCompleted ? (
									<Eye size={16} />
								) : (
									<EyeOff size={16} />
								)}
								{showCompleted
									? 'Показаны выполненные'
									: 'Скрыты выполненные'}
							</button>
						</div>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
