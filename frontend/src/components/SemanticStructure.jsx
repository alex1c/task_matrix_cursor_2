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
			const baseUrl = 'https://todolist.su';
			const url = hreflang === 'ru' ? baseUrl : `${baseUrl}/${hreflang}/`;
			tag.setAttribute('href', url);
		});

		// Обновляем canonical URL в зависимости от текущей страницы
		const updateCanonical = () => {
			const currentPath = window.location.hash.slice(1) || '/';
			const canonicalUrl = currentPath === '/' 
				? 'https://todolist.su/' 
				: `https://todolist.su${currentPath}`;
			
			let canonicalTag = document.querySelector('link[rel="canonical"]');
			if (!canonicalTag) {
				canonicalTag = document.createElement('link');
				canonicalTag.setAttribute('rel', 'canonical');
				document.head.appendChild(canonicalTag);
			}
			canonicalTag.setAttribute('href', canonicalUrl);
		};

		updateCanonical();
		window.addEventListener('hashchange', updateCanonical);

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

		return () => {
			window.removeEventListener('hashchange', updateCanonical);
		};
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
							url: 'https://todolist.su/logo.png',
						},
					},
					datePublished: '2024-01-15',
					dateModified: new Date().toISOString().split('T')[0],
					mainEntityOfPage: {
						'@type': 'WebPage',
						'@id': `https://todolist.su/${
							locale === 'ru' ? '' : locale + '/'
						}`,
					},
					image: 'https://todolist.su/og-image.jpg',
					articleSection: t('seo.section'),
					keywords: t('seo.keywordsList'),
					inLanguage: locale,
				})}
			</script>

			{/* FAQ Schema - Extended with 15 questions */}
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: Array.from({ length: 15 }, (_, i) => ({
						'@type': 'Question',
						name: t(`seoContent.faq.question${i + 1}`) || t(`seo.faq${i + 1}.question`),
						acceptedAnswer: {
							'@type': 'Answer',
							text: t(`seoContent.faq.answer${i + 1}`) || t(`seo.faq${i + 1}.answer`),
						},
					})).filter(q => q.name && q.acceptedAnswer.text),
					inLanguage: locale,
				})}
			</script>

			{/* HowTo Schema */}
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'HowTo',
					name: t('seoContent.howTo.title') || t('seo.howToUse'),
					description: t('seoContent.howTo.section1.content') || t('seo.description'),
					step: [
						{
							'@type': 'HowToStep',
							position: 1,
							name: t('seoContent.howTo.section1.step1') || t('seo.step1'),
							text: t('seoContent.howTo.section1.step1') || t('seo.step1'),
						},
						{
							'@type': 'HowToStep',
							position: 2,
							name: t('seoContent.howTo.section1.step2') || t('seo.step2'),
							text: t('seoContent.howTo.section1.step2') || t('seo.step2'),
						},
						{
							'@type': 'HowToStep',
							position: 3,
							name: t('seoContent.howTo.section1.step3') || t('seo.step3'),
							text: t('seoContent.howTo.section1.step3') || t('seo.step3'),
						},
						{
							'@type': 'HowToStep',
							position: 4,
							name: t('seoContent.howTo.section1.step4') || t('seo.step4'),
							text: t('seoContent.howTo.section1.step4') || t('seo.step4'),
						},
						{
							'@type': 'HowToStep',
							position: 5,
							name: t('seoContent.howTo.section1.step5') || t('seo.step5'),
							text: t('seoContent.howTo.section1.step5') || t('seo.step5'),
						},
					],
					totalTime: 'PT30M',
					inLanguage: locale,
				})}
			</script>

			{/* Breadcrumbs Schema */}
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{
							'@type': 'ListItem',
							position: 1,
							name: t('seo.title') || 'Главная',
							item: 'https://todolist.su/',
						},
					],
				})}
			</script>

			{/* Organization Schema */}
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'Organization',
					name: t('seo.author'),
					url: 'https://todolist.su/',
					logo: 'https://todolist.su/logo.png',
					sameAs: [],
					contactPoint: {
						'@type': 'ContactPoint',
						contactType: 'Customer Service',
						availableLanguage: ['ru', 'en', 'de', 'es', 'zh'],
					},
				})}
			</script>
		</>
	);
};

export default SemanticStructure;
