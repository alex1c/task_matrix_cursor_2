import React from 'react';
import PageLayout from '../PageLayout';
import { useTranslations } from '../../context/I18nContext';

const About = ({ onBack }) => {
	const { t } = useTranslations();

	return (
		<PageLayout title={t('pages.about.title')} onBack={onBack}>
			<div className='space-y-6'>
				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						{t('pages.about.section1.title')}
					</h2>
					<p className='text-gray-700 dark:text-gray-300 mb-4'>
						{t('pages.about.section1.content')}
					</p>
					<p className='text-gray-700 dark:text-gray-300'>
						{t('pages.about.section1.content2')}
					</p>
				</section>

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						{t('pages.about.section2.title')}
					</h2>
					<ul className='list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4'>
						<li>{t('pages.about.section2.item1')}</li>
						<li>{t('pages.about.section2.item2')}</li>
						<li>{t('pages.about.section2.item3')}</li>
						<li>{t('pages.about.section2.item4')}</li>
						<li>{t('pages.about.section2.item5')}</li>
					</ul>
				</section>

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						{t('pages.about.section3.title')}
					</h2>
					<p className='text-gray-700 dark:text-gray-300 mb-4'>
						{t('pages.about.section3.content')}
					</p>
					<p className='text-gray-700 dark:text-gray-300'>
						{t('pages.about.section3.content2')}
					</p>
				</section>

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						{t('pages.about.section4.title')}
					</h2>
					<p className='text-gray-700 dark:text-gray-300'>
						{t('pages.about.section4.content')}
					</p>
				</section>
			</div>
		</PageLayout>
	);
};

export default About;

