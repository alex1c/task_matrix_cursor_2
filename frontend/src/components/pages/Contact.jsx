import React from 'react';
import PageLayout from '../PageLayout';
import { useTranslations } from '../../context/I18nContext';
import AuthorContact from '../AuthorContact';

const Contact = ({ onBack }) => {
	const { t } = useTranslations();

	return (
		<PageLayout title={t('pages.contact.title')} onBack={onBack}>
			<div className='space-y-6'>
				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						{t('pages.contact.section1.title')}
					</h2>
					<p className='text-gray-700 dark:text-gray-300 mb-4'>
						{t('pages.contact.section1.content')}
					</p>
					<p className='text-gray-700 dark:text-gray-300'>
						{t('pages.contact.section1.content2')}
					</p>
				</section>

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						{t('pages.contact.section2.title')}
					</h2>
					<div className='bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700'>
						<AuthorContact />
					</div>
				</section>

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						{t('pages.contact.section3.title')}
					</h2>
					<p className='text-gray-700 dark:text-gray-300'>
						{t('pages.contact.section3.content')}
					</p>
				</section>
			</div>
		</PageLayout>
	);
};

export default Contact;

