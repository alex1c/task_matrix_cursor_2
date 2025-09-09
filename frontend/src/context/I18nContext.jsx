import React, { createContext, useContext, useState, useEffect } from 'react';

// Supported locales
export const locales = {
	ru: { name: 'Русский', flag: '🇷🇺' },
	en: { name: 'English', flag: '🇺🇸' },
	de: { name: 'Deutsch', flag: '🇩🇪' },
	es: { name: 'Español', flag: '🇪🇸' },
	zh: { name: '中文', flag: '🇨🇳' },
};

// Default locale
const defaultLocale = 'ru';

// Create context
const I18nContext = createContext();

// Custom hook to use translations
export const useTranslations = () => {
	const context = useContext(I18nContext);
	if (!context) {
		throw new Error('useTranslations must be used within an I18nProvider');
	}
	return context;
};

// Fallback Russian messages to avoid loading issues
const fallbackMessages = {
	common: {
		add: 'Добавить',
		edit: 'Редактировать',
		delete: 'Удалить',
		save: 'Сохранить',
		cancel: 'Отмена',
		close: 'Закрыть',
		loading: 'Загрузка...',
		error: 'Ошибка',
		success: 'Успешно',
		confirm: 'Подтвердить',
		yes: 'Да',
		no: 'Нет',
		export: 'Экспорт в CSV',
		sort: 'Сортировка',
		byPriority: 'По приоритету',
		byDate: 'По дате',
		byName: 'По названию',
		all: 'Все',
		incomplete: 'Не выполненные',
		completed: 'Выполненные',
		filters: 'Фильтры и сортировка',
		priority: 'приоритеты',
		allPriorities: 'Все приоритеты',
	},
	header: {
		title: 'Матрица Эйзенхауэра',
		subtitle: 'Управление задачами по приоритетам',
	},
	task: {
		title: 'Название задачи',
		description: 'Описание',
		priority: 'Приоритет',
		dueDate: 'Дата выполнения',
		quadrant: 'Квадрант',
		completed: 'Выполнено',
		newTask: 'Новая задача',
		createTask: 'Создать задачу',
		editTask: 'Редактировать задачу',
		deleteTask: 'Удалить задачу',
		moveTask: 'Переместить задачу',
		markComplete: 'Отметить как выполненную',
		markIncomplete: 'Отметить как невыполненную',
		noTasks: 'Нет задач',
		dragHere: 'Перетащите задачу сюда или создайте новую',
		status: 'Статус задач',
		tasks: 'задач',
		taskCount: {
			one: 'задача',
			few: 'задачи',
			many: 'задач',
		},
	},
	priorities: {
		high: 'Высокий',
		medium: 'Средний',
		low: 'Низкий',
	},
	quadrants: {
		urgentImportant: {
			title: 'Важно и Срочно',
			subtitle: 'Делайте немедленно',
		},
		importantNotUrgent: {
			title: 'Важно, но не Срочно',
			subtitle: 'Планируйте заранее',
		},
		urgentNotImportant: {
			title: 'Срочно, но не Важно',
			subtitle: 'Делегируйте другим',
		},
		notUrgentNotImportant: {
			title: 'Не Важно и не Срочно',
			subtitle: 'Исключите из списка',
		},
	},
};

// Provider component
export const I18nProvider = ({ children }) => {
	const [locale, setLocale] = useState(defaultLocale);
	const [messages, setMessages] = useState(fallbackMessages);
	const [isLoading, setIsLoading] = useState(true);

	// Load messages for the current locale
	useEffect(() => {
		const loadMessages = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(`/messages/${locale}.json`);
				if (response.ok) {
					const data = await response.json();
					setMessages(data);
				} else {
					console.error(
						`Failed to load messages for locale: ${locale}`
					);
					// Fallback to default locale
					if (locale !== defaultLocale) {
						const fallbackResponse = await fetch(
							`/messages/${defaultLocale}.json`
						);
						if (fallbackResponse.ok) {
							const fallbackData = await fallbackResponse.json();
							setMessages(fallbackData);
						}
					}
				}
			} catch (error) {
				console.error('Error loading messages:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadMessages();
	}, [locale]);

	// Function to get translation
	const t = (key, params = {}) => {
		// If still loading, return the key to avoid console warnings
		if (isLoading) {
			return key;
		}

		const keys = key.split('.');
		let value = messages;

		for (const k of keys) {
			if (value && typeof value === 'object' && k in value) {
				value = value[k];
			} else {
				// Only warn if not loading and messages are available
				if (!isLoading && Object.keys(messages).length > 0) {
					console.warn(`Translation key not found: ${key}`);
				}
				return key; // Return the key if translation not found
			}
		}

		// Replace parameters in the translation
		if (typeof value === 'string' && Object.keys(params).length > 0) {
			return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
				return params[paramKey] || match;
			});
		}

		return value || key;
	};

	// Function to change locale
	const changeLocale = (newLocale) => {
		if (locales[newLocale]) {
			setLocale(newLocale);
			// Save to localStorage
			localStorage.setItem('preferred-locale', newLocale);
		}
	};

	// Load saved locale on mount
	useEffect(() => {
		const savedLocale = localStorage.getItem('preferred-locale');
		if (savedLocale && locales[savedLocale]) {
			setLocale(savedLocale);
		}
	}, []);

	const value = {
		locale,
		locales,
		t,
		changeLocale,
		isLoading,
	};

	return (
		<I18nContext.Provider value={value}>{children}</I18nContext.Provider>
	);
};
