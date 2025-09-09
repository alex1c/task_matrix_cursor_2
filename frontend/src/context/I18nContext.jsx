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
	modal: {
		createTask: 'Создать новую задачу',
		editTask: 'Редактировать задачу',
		required: 'Обязательное поле',
		optional: 'Необязательное',
		titleRequired: 'Пожалуйста, введите название задачи',
		titlePlaceholder: 'Введите название задачи',
		descriptionPlaceholder: 'Дополнительное описание (необязательно)',
	},
	statistics: {
		title: 'Статистика',
		totalTasks: 'Всего задач',
		completedTasks: 'Выполнено',
		pendingTasks: 'В ожидании',
		completionRate: 'Процент выполнения',
		chartTitle: 'Куда уходит время',
		noTasksToDisplay: 'Нет задач для отображения',
		totalTasks: 'Всего задач',
		completed: 'Выполнено',
		whatIsEisenhowerMatrix: 'Что такое матрица Эйзенхауэра?',
		eisenhowerMatrix: 'Матрица Эйзенхауэра',
		description:
			'это инструмент для приоритизации задач, разработанный 34-м президентом США Дуайтом Эйзенхауэром. Она помогает организовать задачи по важности и срочности.',
		urgentImportantDesc:
			'Кризисы, срочные проблемы, дедлайны. Выполняйте немедленно.',
		importantNotUrgentDesc:
			'Планирование, развитие, отношения. Запланируйте время для выполнения.',
		urgentNotImportantDesc:
			'Отвлечения, некоторые звонки, встречи. Делегируйте или минимизируйте.',
		notUrgentNotImportantDesc:
			'Пустая трата времени, отвлекающие факторы. Удалите или отложите.',
		usageTip: 'Совет по использованию',
		usageTipText:
			'Старайтесь проводить больше времени в квадранте "Важно, но не Срочно". Это поможет предотвратить появление задач в квадранте "Важно и Срочно".',
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
	share: {
		title: 'Матрица Эйзенхауэра - Управление задачами',
		description:
			'Эффективное планирование задач с помощью матрицы Эйзенхауэра. Разделяйте задачи по важности и срочности.',
		shareTitle: 'Поделиться',
		shareDescription:
			'Помогите друзьям и коллегам эффективно управлять задачами с помощью матрицы Эйзенхауэра',
		shareIn: 'Поделиться в {platform}',
		linkCopied: 'Ссылка скопирована!',
		copyError: 'Не удалось скопировать ссылку',
		copied: 'Скопировано!',
		copyLink: 'Копировать ссылку',
		additionalInfo:
			'Матрица Эйзенхауэра поможет вам расставить приоритеты и повысить продуктивность',
	},
	author: {
		contactTitle: 'Связаться с автором',
		contactDescription:
			'Есть вопросы по проекту или предложения по улучшению? Свяжитесь с автором',
		emailLabel: 'Email автора:',
		showEmail: 'Показать email',
		hideEmail: 'Скрыть email',
		copyEmail: 'Копировать email',
		copied: 'Скопировано!',
		emailCopied: 'Email скопирован!',
		copyError: 'Не удалось скопировать email',
		responseTime: 'Автор отвечает на все сообщения в течение 24-48 часов',
	},
	theme: {
		standard: 'Стандартная',
		retro: 'Ретро',
		neon: 'Неон',
		switchToLight: 'Переключить на светлую тему',
		switchToDark: 'Переключить на темную тему',
	},
	serviceInfo: {
		title: 'Простой и безопасный менеджер задач',
		subtitle: 'Используйте сервис бесплатно для личных целей.',
		feature1: 'Создание и перемещение задач (drag & drop)',
		feature2: 'Фильтрация по статусу и приоритету',
		feature3: 'Режимы: все, выполненные, невыполненные',
		feature4: 'Cookies для идентификации — задачи видите только вы',
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
			console.log(`Loading messages for locale: ${locale}`);
			try {
				const url = `/messages/${locale}.json?t=${Date.now()}`;
				console.log(`Fetching URL: ${url}`);
				const response = await fetch(url);
				console.log(`Response status for ${locale}:`, response.status);

				if (response.ok) {
					const data = await response.json();
					console.log(`Loaded messages for ${locale}:`, data);
					console.log(
						`Sample translation for ${locale}:`,
						data.common?.add
					);
					setMessages(data);
				} else {
					console.error(
						`Failed to load messages for locale: ${locale}, status: ${response.status}`
					);
					// Fallback to default locale
					if (locale !== defaultLocale) {
						console.log(
							`Falling back to default locale: ${defaultLocale}`
						);
						const fallbackResponse = await fetch(
							`/messages/${defaultLocale}.json?t=${Date.now()}`
						);
						if (fallbackResponse.ok) {
							const fallbackData = await fallbackResponse.json();
							console.log(
								`Loaded fallback messages:`,
								fallbackData
							);
							setMessages(fallbackData);
						}
					}
				}
			} catch (error) {
				console.error('Error loading messages:', error);
				console.log('Falling back to hardcoded messages due to error');
				setMessages(fallbackMessages);
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
		console.log(`Changing locale from ${locale} to ${newLocale}`);
		if (locales[newLocale]) {
			setLocale(newLocale);
			// Save to localStorage
			localStorage.setItem('preferred-locale', newLocale);
			console.log(`Locale changed to: ${newLocale}`);
		} else {
			console.error(`Invalid locale: ${newLocale}`);
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
