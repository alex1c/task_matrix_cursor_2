import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from '../context/I18nContext';

const PageLayout = ({ title, children, onBack }) => {
	const { t } = useTranslations();

	return (
		<div className='min-h-screen py-8'>
			<div className='container mx-auto px-4 max-w-4xl'>
				{/* Кнопка назад */}
				{onBack && (
					<button
						onClick={onBack}
						className='mb-6 flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline transition-colors'
					>
						<ArrowLeft size={20} />
						{t('common.back')}
					</button>
				)}

				{/* Заголовок */}
				<h1 className='text-4xl font-bold mb-8 text-gray-900 dark:text-white'>
					{title}
				</h1>

				{/* Контент */}
				<div className='prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-2xl shadow-medium p-8 border border-gray-200 dark:border-gray-700'>
					{children}
				</div>
			</div>
		</div>
	);
};

export default PageLayout;

