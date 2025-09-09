import React, { useEffect } from 'react';
import { useTranslations } from '../context/I18nContext';

const SemanticStructure = () => {
	const { t, locale } = useTranslations();

	// Обновляем title страницы в зависимости от языка
	useEffect(() => {
		const titles = {
			ru: 'Матрица Эйзенхауэра - Управление задачами и приоритетами | Бесплатный планировщик',
			en: 'Eisenhower Matrix - Task Management and Priorities | Free Planner',
			de: 'Eisenhower-Matrix - Aufgabenmanagement und Prioritäten | Kostenloser Planer',
			es: 'Matriz de Eisenhower - Gestión de Tareas y Prioridades | Planificador Gratuito',
			zh: '艾森豪威尔矩阵 - 任务管理和优先级 | 免费规划器',
		};

		document.title = titles[locale] || titles.ru;

		// Обновляем meta description
		const descriptions = {
			ru: 'Эффективное планирование задач с помощью матрицы Эйзенхауэра. Разделяйте задачи по важности и срочности. Бесплатный онлайн-планировщик для повышения продуктивности.',
			en: 'Effective task planning with the Eisenhower Matrix. Organize tasks by importance and urgency. Free online planner for increased productivity.',
			de: 'Effektive Aufgabenplanung mit der Eisenhower-Matrix. Organisieren Sie Aufgaben nach Wichtigkeit und Dringlichkeit. Kostenloser Online-Planer für mehr Produktivität.',
			es: 'Planificación efectiva de tareas con la Matriz de Eisenhower. Organice las tareas por importancia y urgencia. Planificador en línea gratuito para mayor productividad.',
			zh: '使用艾森豪威尔矩阵进行有效的任务规划。按重要性和紧急性组织任务。免费在线规划器，提高生产力。',
		};

		const metaDescription = document.querySelector(
			'meta[name="description"]'
		);
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				descriptions[locale] || descriptions.ru
			);
		}

		// Обновляем hreflang
		const hreflangTags = document.querySelectorAll(
			'link[rel="alternate"][hreflang]'
		);
		hreflangTags.forEach((tag) => {
			const hreflang = tag.getAttribute('hreflang');
			const baseUrl = 'https://eisenhower-matrix.ru';
			const url = hreflang === 'ru' ? baseUrl : `${baseUrl}/${hreflang}/`;
			tag.setAttribute('href', url);
		});

		// Обновляем og:locale
		const ogLocale = document.querySelector('meta[property="og:locale"]');
		if (ogLocale) {
			const locales = {
				ru: 'ru_RU',
				en: 'en_US',
				de: 'de_DE',
				es: 'es_ES',
				zh: 'zh_CN',
			};
			ogLocale.setAttribute('content', locales[locale] || 'ru_RU');
		}
	}, [locale]);

	return (
		<>
			{/* Скрытые семантические элементы для SEO */}
			<div style={{ display: 'none' }}>
				<h1>{t('seo.title')}</h1>
				<h2>{t('seo.subtitle')}</h2>
				<h3>{t('seo.whatIs')}</h3>
				<p>{t('seo.description')}</p>

				<h3>{t('seo.benefits')}</h3>
				<ul>
					<li>{t('seo.benefit1')}</li>
					<li>{t('seo.benefit2')}</li>
					<li>{t('seo.benefit3')}</li>
					<li>{t('seo.benefit4')}</li>
					<li>{t('seo.benefit5')}</li>
				</ul>

				<h3>{t('seo.howToUse')}</h3>
				<ol>
					<li>{t('seo.step1')}</li>
					<li>{t('seo.step2')}</li>
					<li>{t('seo.step3')}</li>
					<li>{t('seo.step4')}</li>
					<li>{t('seo.step5')}</li>
				</ol>

				<h3>{t('seo.quadrants')}</h3>
				<h4>{t('seo.quadrant1')}</h4>
				<p>{t('seo.quadrant1Desc')}</p>

				<h4>{t('seo.quadrant2')}</h4>
				<p>{t('seo.quadrant2Desc')}</p>

				<h4>{t('seo.quadrant3')}</h4>
				<p>{t('seo.quadrant3Desc')}</p>

				<h4>{t('seo.quadrant4')}</h4>
				<p>{t('seo.quadrant4Desc')}</p>

				<h3>{t('seo.keywords')}</h3>
				<p>{t('seo.keywordsList')}</p>
			</div>

			{/* Семантическая разметка для поисковых систем */}
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'Article',
					headline: t('seo.title'),
					description: t('seo.description'),
					author: {
						'@type': 'Organization',
						name: t('seo.author'),
					},
					publisher: {
						'@type': 'Organization',
						name: t('seo.author'),
						logo: {
							'@type': 'ImageObject',
							url: 'https://eisenhower-matrix.ru/logo.png',
						},
					},
					datePublished: '2024-01-15',
					dateModified: new Date().toISOString().split('T')[0],
					mainEntityOfPage: {
						'@type': 'WebPage',
						'@id': `https://eisenhower-matrix.ru/${
							locale === 'ru' ? '' : locale + '/'
						}`,
					},
					image: 'https://eisenhower-matrix.ru/og-image.jpg',
					articleSection: t('seo.section'),
					keywords: t('seo.keywordsList'),
					inLanguage: locale,
				})}
			</script>

			{/* FAQ Schema */}
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: [
						{
							'@type': 'Question',
							name: t('seo.faq1.question'),
							acceptedAnswer: {
								'@type': 'Answer',
								text: t('seo.faq1.answer'),
							},
						},
						{
							'@type': 'Question',
							name: t('seo.faq2.question'),
							acceptedAnswer: {
								'@type': 'Answer',
								text: t('seo.faq2.answer'),
							},
						},
						{
							'@type': 'Question',
							name: t('seo.faq3.question'),
							acceptedAnswer: {
								'@type': 'Answer',
								text: t('seo.faq3.answer'),
							},
						},
					],
					inLanguage: locale,
				})}
			</script>
		</>
	);
};

export default SemanticStructure;
