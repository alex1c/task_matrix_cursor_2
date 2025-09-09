import React, { useState } from 'react';
import {
	Share2,
	Facebook,
	Twitter,
	Linkedin,
	Send,
	MessageCircle,
	MessageSquare,
	Copy,
	Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from '../context/I18nContext';

const ShareBlock = () => {
	const [copied, setCopied] = useState(false);
	const { t } = useTranslations();
	const currentUrl = window.location.href;
	const title = t('share.title');
	const description = t('share.description');

	// Функция для копирования ссылки
	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(currentUrl);
			setCopied(true);
			toast.success(t('share.linkCopied'));
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error('Ошибка копирования:', error);
			toast.error(t('share.copyError'));
		}
	};

	// Функция для открытия социальных сетей
	const openShareWindow = (url) => {
		window.open(
			url,
			'_blank',
			'width=600,height=400,scrollbars=yes,resizable=yes'
		);
	};

	// Социальные сети
	const shareOptions = [
		{
			name: 'Facebook',
			icon: Facebook,
			color: 'bg-blue-600 hover:bg-blue-700',
			url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
				currentUrl
			)}`,
		},
		{
			name: 'Twitter',
			icon: Twitter,
			color: 'bg-sky-500 hover:bg-sky-600',
			url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
				currentUrl
			)}&text=${encodeURIComponent(title)}`,
		},
		{
			name: 'LinkedIn',
			icon: Linkedin,
			color: 'bg-blue-700 hover:bg-blue-800',
			url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
				currentUrl
			)}`,
		},
		{
			name: 'Telegram',
			icon: Send,
			color: 'bg-blue-500 hover:bg-blue-600',
			url: `https://t.me/share/url?url=${encodeURIComponent(
				currentUrl
			)}&text=${encodeURIComponent(title)}`,
		},
		{
			name: 'VKontakte',
			icon: MessageCircle,
			color: 'bg-blue-600 hover:bg-blue-700',
			url: `https://vk.com/share.php?url=${encodeURIComponent(
				currentUrl
			)}&title=${encodeURIComponent(
				title
			)}&description=${encodeURIComponent(description)}`,
		},
		{
			name: 'WhatsApp',
			icon: MessageSquare,
			color: 'bg-green-500 hover:bg-green-600',
			url: `https://wa.me/?text=${encodeURIComponent(
				title + ' ' + currentUrl
			)}`,
		},
	];

	return (
		<div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-700'>
			<div className='text-center'>
				{/* Заголовок */}
				<div className='flex items-center justify-center gap-3 mb-6'>
					<Share2 className='w-6 h-6 text-primary-600 dark:text-primary-400' />
					<h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
						{t('share.shareTitle')}
					</h3>
				</div>

				{/* Описание */}
				<p className='text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto'>
					{t('share.shareDescription')}
				</p>

				{/* Кнопки социальных сетей */}
				<div className='flex flex-wrap justify-center gap-4 mb-8'>
					{shareOptions.map((option) => {
						const IconComponent = option.icon;
						return (
							<button
								key={option.name}
								onClick={() => openShareWindow(option.url)}
								className={`
									flex items-center gap-2 px-4 py-3 rounded-xl text-white font-medium
									transition-all duration-300 hover:scale-105 shadow-soft hover:shadow-medium
									${option.color}
								`}
								title={t('share.shareIn', {
									platform: option.name,
								})}
							>
								<IconComponent className='w-5 h-5' />
								<span className='hidden sm:inline'>
									{option.name}
								</span>
							</button>
						);
					})}
				</div>

				{/* Кнопка копирования ссылки */}
				<div className='flex items-center justify-center gap-4'>
					<div className='flex-1 max-w-md'>
						<div className='relative'>
							<input
								type='text'
								value={currentUrl}
								readOnly
								className='w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-600 
									bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm
									focus:outline-none focus:ring-2 focus:ring-primary-500'
							/>
							<button
								onClick={copyToClipboard}
								className={`
									absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg
									transition-all duration-300 hover:scale-110
									${
										copied
											? 'bg-green-500 text-white'
											: 'bg-primary-500 hover:bg-primary-600 text-white'
									}
								`}
								title={
									copied
										? t('share.copied')
										: t('share.copyLink')
								}
							>
								{copied ? (
									<Check className='w-4 h-4' />
								) : (
									<Copy className='w-4 h-4' />
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Дополнительная информация */}
				<div className='mt-8 text-sm text-gray-500 dark:text-gray-400'>
					<p>{t('share.additionalInfo')}</p>
				</div>
			</div>
		</div>
	);
};

export default ShareBlock;
