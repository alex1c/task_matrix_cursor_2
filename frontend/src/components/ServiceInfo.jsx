import React from 'react';
import { Info } from 'lucide-react';
import { useTranslations } from '../context/I18nContext';

const ServiceInfo = () => {
	const { t } = useTranslations();

	const handleGuideClick = () => {
		window.location.hash = '/seo';
	};

	return (
		<section className='p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center space-y-6'>
			<h2 className='text-3xl font-bold text-green-700 dark:text-green-400'>
				{t('serviceInfo.title')}
			</h2>
			<p className='text-lg text-gray-600 dark:text-gray-300'>
				{t('serviceInfo.subtitle')}
			</p>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-left'>
				<div>✔ {t('serviceInfo.feature1')}</div>
				<div>✔ {t('serviceInfo.feature2')}</div>
				<div>✔ {t('serviceInfo.feature3')}</div>
				<div>✔ {t('serviceInfo.feature4')}</div>
			</div>
			<div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
				<button
					onClick={handleGuideClick}
					className='inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-semibold shadow-md hover:shadow-lg'
				>
					<Info size={20} />
					{t('serviceInfo.guideButton') || 'Подробное руководство по использованию'}
				</button>
			</div>
		</section>
	);
};

export default ServiceInfo;
