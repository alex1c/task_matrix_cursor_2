import React from 'react';
import PageLayout from '../PageLayout';
import { useTranslations } from '../../context/I18nContext';

const SEOContent = ({ onBack }) => {
	const { t } = useTranslations();

	return (
		<PageLayout title={t('pages.seoContent.title')} onBack={onBack}>
			<div className='space-y-8'>
				{/* HowTo Section */}
				<section className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-blue-200 dark:border-gray-700'>
					<h2 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white'>
						{t('pages.seoContent.howTo.title')}
					</h2>
					
					<div className='space-y-6'>
						<div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md'>
							<h3 className='text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400'>
								{t('pages.seoContent.howTo.section1.title')}
							</h3>
							<div className='space-y-3 text-gray-700 dark:text-gray-300'>
								<p>{t('pages.seoContent.howTo.section1.content')}</p>
								<ol className='list-decimal list-inside space-y-2 ml-4'>
									<li>{t('pages.seoContent.howTo.section1.step1')}</li>
									<li>{t('pages.seoContent.howTo.section1.step2')}</li>
									<li>{t('pages.seoContent.howTo.section1.step3')}</li>
									<li>{t('pages.seoContent.howTo.section1.step4')}</li>
									<li>{t('pages.seoContent.howTo.section1.step5')}</li>
								</ol>
							</div>
						</div>

						<div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md'>
							<h3 className='text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400'>
								{t('pages.seoContent.howTo.section2.title')}
							</h3>
							<div className='space-y-3 text-gray-700 dark:text-gray-300'>
								<p>{t('pages.seoContent.howTo.section2.content')}</p>
								<ul className='list-disc list-inside space-y-2 ml-4'>
									<li>{t('pages.seoContent.howTo.section2.item1')}</li>
									<li>{t('pages.seoContent.howTo.section2.item2')}</li>
									<li>{t('pages.seoContent.howTo.section2.item3')}</li>
									<li>{t('pages.seoContent.howTo.section2.item4')}</li>
								</ul>
							</div>
						</div>

						<div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md'>
							<h3 className='text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400'>
								{t('pages.seoContent.howTo.section3.title')}
							</h3>
							<div className='space-y-3 text-gray-700 dark:text-gray-300'>
								<p>{t('pages.seoContent.howTo.section3.content')}</p>
								<p>{t('pages.seoContent.howTo.section3.content2')}</p>
							</div>
						</div>

						<div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md'>
							<h3 className='text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400'>
								{t('pages.seoContent.howTo.section4.title')}
							</h3>
							<div className='space-y-3 text-gray-700 dark:text-gray-300'>
								<p>{t('pages.seoContent.howTo.section4.content')}</p>
								<ul className='list-disc list-inside space-y-2 ml-4'>
									<li>{t('pages.seoContent.howTo.section4.item1')}</li>
									<li>{t('pages.seoContent.howTo.section4.item2')}</li>
									<li>{t('pages.seoContent.howTo.section4.item3')}</li>
									<li>{t('pages.seoContent.howTo.section4.item4')}</li>
								</ul>
							</div>
						</div>
					</div>
				</section>

				{/* FAQ Section */}
				<section className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-green-200 dark:border-gray-700'>
					<h2 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white'>
						{t('pages.seoContent.faq.title')}
					</h2>
					
					<div className='space-y-4'>
						{Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
							<div
								key={num}
								className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-primary-500'
							>
								<h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-white'>
									{t(`pages.seoContent.faq.question${num}`)}
								</h3>
								<p className='text-gray-700 dark:text-gray-300'>
									{t(`pages.seoContent.faq.answer${num}`)}
								</p>
							</div>
						))}
					</div>
				</section>
			</div>
		</PageLayout>
	);
};

export default SEOContent;

