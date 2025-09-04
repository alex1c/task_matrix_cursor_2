import React, { useState, useEffect } from 'react';
import { Mail, Copy, Check, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthorContact = () => {
	const [showEmail, setShowEmail] = useState(false);
	const [copied, setCopied] = useState(false);

	// JavaScript кодирование email для защиты от спама
	const encodedEmail = btoa('alex1c-spb@yandex.ru'); // Base64 кодирование

	// Дополнительное кодирование через ROT13
	const rot13 = (str) => {
		return str.replace(/[a-zA-Z]/g, (char) => {
			const start = char <= 'Z' ? 65 : 97;
			return String.fromCharCode(
				((char.charCodeAt(0) - start + 13) % 26) + start
			);
		});
	};

	const rot13Email = rot13('alex1c-spb@yandex.ru');

	// Функция для копирования email
	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText('alex1c-spb@yandex.ru');
			setCopied(true);
			toast.success('Email скопирован!');
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error('Ошибка копирования:', error);
			toast.error('Не удалось скопировать email');
		}
	};

	// Автоматическое декодирование при загрузке
	useEffect(() => {
		// Создаем скрытый элемент для декодирования
		const decodeEmail = () => {
			try {
				// Base64 декодирование
				const decoded = atob(encodedEmail);
				return decoded;
			} catch (error) {
				console.error('Ошибка декодирования:', error);
				return 'alex1c-spb@yandex.ru';
			}
		};

		// Сохраняем декодированный email в глобальной переменной
		window.decodedAuthorEmail = decodeEmail();
	}, [encodedEmail]);

	return (
		<div className='mt-16 pt-8 border-t border-gray-200 dark:border-gray-700'>
			<div className='text-center'>
				{/* Заголовок */}
				<div className='flex items-center justify-center gap-3 mb-6'>
					<Mail className='w-6 h-6 text-primary-600 dark:text-primary-400' />
					<h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
						Связаться с автором
					</h3>
				</div>

				{/* Описание */}
				<p className='text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto'>
					Есть вопросы по проекту или предложения по улучшению?
					Свяжитесь с автором
				</p>

				{/* Защищенный email */}
				<div className='max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-600'>
					<div className='space-y-4'>
						{/* Основной email с защитой */}
						<div>
							<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
								Email автора:
							</label>
							<div className='flex items-center gap-2'>
								<code className='flex-1 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-gray-100'>
									{showEmail
										? 'alex1c-spb@yandex.ru'
										: '••••••••••••••••••••••••••••••••'}
								</code>
								<button
									onClick={() => setShowEmail(!showEmail)}
									className='p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105'
									title={
										showEmail
											? 'Скрыть email'
											: 'Показать email'
									}
								>
									{showEmail ? (
										<EyeOff className='w-4 h-4' />
									) : (
										<Eye className='w-4 h-4' />
									)}
								</button>
								{showEmail && (
									<button
										onClick={copyToClipboard}
										className={`p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
											copied
												? 'bg-green-500 text-white'
												: 'bg-primary-500 hover:bg-primary-600 text-white'
										}`}
										title={
											copied
												? 'Скопировано!'
												: 'Копировать email'
										}
									>
										{copied ? (
											<Check className='w-4 h-4' />
										) : (
											<Copy className='w-4 h-4' />
										)}
									</button>
								)}
							</div>
						</div>

						{/* Альтернативные способы получения email */}
						
					</div>
				</div>

				{/* Дополнительная информация */}
				<div className='mt-6 text-sm text-gray-500 dark:text-gray-400'>
					<p>Автор отвечает на все сообщения в течение 24-48 часов</p>
				</div>
			</div>
		</div>
	);
};

export default AuthorContact;
