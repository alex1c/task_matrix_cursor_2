import React, { useState } from 'react';
import {
	Sun,
	Moon,
	Monitor,
	Zap,
	Palette,
	Download,
	Filter,
	SortAsc,
	SortDesc,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { useTranslations } from '../context/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
	const { theme, isDark, toggleDarkMode, changeTheme } = useTheme();
	const {
		sortBy,
		setSortBy,
		filterStatus,
		setFilterStatus,
		filterPriority,
		setFilterPriority,
		exportToCSV,
	} = useTasks();
	const { t } = useTranslations();

	const [showFilters, setShowFilters] = useState(false);

	const themes = [
		{ id: 'standard', name: t('theme.standard'), icon: Monitor },
		{ id: 'retro', name: t('theme.retro'), icon: Palette },
		{ id: 'neon', name: t('theme.neon'), icon: Zap },
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

	const handleHomeClick = () => {
		// Navigate to home page using hash routing
		window.location.hash = '';
	};

	return (
		<header className='mb-8'>
			<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
				{/* Заголовок */}
				<button
					onClick={handleHomeClick}
					className='text-center lg:text-left cursor-pointer hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-2 -m-2'
					title={t('footer.quickLinks.home') || 'Главная'}
				>
					<h1 className='text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 bg-clip-text text-transparent leading-tight'>
						{t('header.title')}
					</h1>
					<p className='text-sm text-gray-600 dark:text-gray-300 mt-2 font-medium'>
						{t('header.subtitle')}
					</p>
				</button>

				{/* Контролы */}
				<div className='flex flex-wrap items-center justify-center lg:justify-end gap-3'>
					{/* Переключатель языков */}
					<LanguageSwitcher />

					{/* Переключатель темной темы */}
					<button
						onClick={toggleDarkMode}
						className='p-3 rounded-xl bg-white dark:bg-gray-800 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700'
						title={
							isDark
								? t('theme.switchToLight')
								: t('theme.switchToDark')
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
						title={t('common.filters')}
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
						title={t('common.export')}
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
							<label className='block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200'>
								{t('common.sort')}
							</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-soft focus:shadow-medium transition-all duration-200 font-medium'
							>
								<option value='priority'>
									{t('common.byPriority')}
								</option>
								<option value='date'>
									{t('common.byDate')}
								</option>
								<option value='name'>
									{t('common.byName')}
								</option>
							</select>
						</div>

						{/* Фильтр по приоритету */}
						<div>
							<label className='block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200'>
								{t('task.priority')}
							</label>
							<select
								value={filterPriority}
								onChange={(e) =>
									setFilterPriority(e.target.value)
								}
								className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-soft focus:shadow-medium transition-all duration-200 font-medium'
							>
								<option value='all'>
									{t('common.allPriorities')}
								</option>
								<option value='high'>
									{t('priorities.high')}
								</option>
								<option value='medium'>
									{t('priorities.medium')}
								</option>
								<option value='low'>
									{t('priorities.low')}
								</option>
							</select>
						</div>

						{/* Фильтр по статусу задач */}
						<div className='flex items-end'>
							<label className='block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200'>
								{t('task.status')}
							</label>
							<select
								value={filterStatus}
								onChange={(e) =>
									setFilterStatus(e.target.value)
								}
								className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 shadow-soft focus:shadow-medium font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300'
							>
								<option value='incomplete'>
									{t('common.incomplete')}
								</option>
								<option value='completed'>
									{t('common.completed')}
								</option>
								<option value='all'>
									{t('common.all')} {t('task.tasks')}
								</option>
							</select>
						</div>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
