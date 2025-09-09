import React from 'react';
import { useTranslations } from '../context/I18nContext';

const ServiceInfo = () => {
	const { t } = useTranslations();

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
		</section>
	);
};

export default ServiceInfo;
