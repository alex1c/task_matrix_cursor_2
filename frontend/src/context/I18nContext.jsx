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
	seo: {
		title: 'Матрица Эйзенхауэра - Управление задачами и приоритетами',
		subtitle: 'Эффективное планирование задач',
		whatIs: 'Что такое матрица Эйзенхауэра?',
		description:
			'Матрица Эйзенхауэра — это инструмент тайм-менеджмента, который помогает разделить задачи на четыре категории по важности и срочности: важные и срочные, важные но не срочные, срочные но не важные, не важные и не срочные.',
		benefits: 'Преимущества использования матрицы Эйзенхауэра',
		benefit1: 'Повышение продуктивности',
		benefit2: 'Эффективное управление временем',
		benefit3: 'Правильная расстановка приоритетов',
		benefit4: 'Снижение стресса от перегрузки задачами',
		benefit5: 'Улучшение качества принимаемых решений',
		howToUse: 'Как использовать матрицу Эйзенхауэра',
		step1: 'Запишите все ваши задачи',
		step2: 'Определите важность каждой задачи',
		step3: 'Определите срочность каждой задачи',
		step4: 'Разместите задачи в соответствующих квадрантах',
		step5: 'Начните с задач из первого квадранта',
		quadrants: 'Квадранты матрицы Эйзенхауэра',
		quadrant1: 'Квадрант 1: Важно и срочно',
		quadrant1Desc: 'Кризисы, срочные проблемы, задачи с дедлайнами.',
		quadrant2: 'Квадрант 2: Важно, но не срочно',
		quadrant2Desc: 'Планирование, развитие, профилактика, обучение.',
		quadrant3: 'Квадрант 3: Срочно, но не важно',
		quadrant3Desc: 'Отвлечения, некоторые звонки, некоторые встречи.',
		quadrant4: 'Квадрант 4: Не важно и не срочно',
		quadrant4Desc: 'Пустая трата времени, избыточные развлечения.',
		keywords: 'Ключевые слова для SEO',
		keywordsList:
			'матрица эйзенхауэра, управление задачами, планирование, приоритеты, продуктивность, тайм-менеджмент, планировщик задач, важные задачи, срочные задачи, эффективность, организация времени, управление временем, планировщик, органайзер задач, система приоритетов, матрица приоритетов, квадранты эйзенхауэра, метод эйзенхауэра, инструменты продуктивности',
		author: 'Матрица Эйзенхауэра',
		section: 'Продуктивность',
		faq1: {
			question: 'Что такое матрица Эйзенхауэра?',
			answer: 'Матрица Эйзенхауэра — это инструмент тайм-менеджмента, который помогает разделить задачи на четыре категории по важности и срочности.',
		},
		faq2: {
			question: 'Как использовать матрицу Эйзенхауэра?',
			answer: 'Запишите все задачи, определите их важность и срочность, разместите в соответствующих квадрантах и начните с важных и срочных задач.',
		},
		faq3: {
			question: 'Какие преимущества дает матрица Эйзенхауэра?',
			answer: 'Повышение продуктивности, эффективное управление временем, правильная расстановка приоритетов, снижение стресса и улучшение качества решений.',
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
				const url = `/messages/${locale}.json?t=${Date.now()}`;
				const response = await fetch(url);

				if (response.ok) {
					const data = await response.json();
					setMessages(data);
				} else {
					// Fallback to default locale
					if (locale !== defaultLocale) {
						const fallbackResponse = await fetch(
							`/messages/${defaultLocale}.json?t=${Date.now()}`
						);
						if (fallbackResponse.ok) {
							const fallbackData = await fallbackResponse.json();
							setMessages(fallbackData);
						}
					}
				}
			} catch (error) {
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
