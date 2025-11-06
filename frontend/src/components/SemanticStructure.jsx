import React, { useEffect } from 'react';
import { useTranslations } from '../context/I18nContext';

const SemanticStructure = ({ currentPage = 'home' }) => {
	const { t, locale } = useTranslations();

	// Page metadata configuration
	const pageMetadata = {
		home: {
			ru: {
				title: 'Матрица Эйзенхауэра - Управление задачами и приоритетами | Бесплатный планировщик',
				description: 'Эффективное планирование задач с помощью матрицы Эйзенхауэра. Разделяйте задачи по важности и срочности. Бесплатный онлайн-планировщик для повышения продуктивности.',
			},
			en: {
				title: 'Eisenhower Matrix - Task Management and Priorities | Free Planner',
				description: 'Effective task planning with the Eisenhower Matrix. Organize tasks by importance and urgency. Free online planner for increased productivity.',
			},
			de: {
				title: 'Eisenhower-Matrix - Aufgabenmanagement und Prioritäten | Kostenloser Planer',
				description: 'Effektive Aufgabenplanung mit der Eisenhower-Matrix. Organisieren Sie Aufgaben nach Wichtigkeit und Dringlichkeit. Kostenloser Online-Planer für mehr Produktivität.',
			},
			es: {
				title: 'Matriz de Eisenhower - Gestión de Tareas y Prioridades | Planificador Gratuito',
				description: 'Planificación efectiva de tareas con la Matriz de Eisenhower. Organice las tareas por importancia y urgencia. Planificador en línea gratuito para mayor productividad.',
			},
			zh: {
				title: '艾森豪威尔矩阵 - 任务管理和优先级 | 免费规划器',
				description: '使用艾森豪威尔矩阵进行有效的任务规划。按重要性和紧急性组织任务。免费在线规划器，提高生产力。',
			},
		},
		seo: {
			ru: {
				title: 'Руководство по матрице Эйзенхауэра | Как эффективно управлять задачами',
				description: 'Подробное руководство по использованию матрицы Эйзенхауэра для управления задачами. Узнайте, как правильно расставлять приоритеты и повышать продуктивность.',
			},
			en: {
				title: 'Eisenhower Matrix Guide | How to Manage Tasks Effectively',
				description: 'Complete guide to using the Eisenhower Matrix for task management. Learn how to prioritize tasks and increase productivity.',
			},
			de: {
				title: 'Eisenhower-Matrix Anleitung | Aufgaben effektiv verwalten',
				description: 'Vollständige Anleitung zur Verwendung der Eisenhower-Matrix für das Aufgabenmanagement. Erfahren Sie, wie Sie Aufgaben priorisieren und die Produktivität steigern.',
			},
			es: {
				title: 'Guía de la Matriz de Eisenhower | Cómo gestionar tareas eficazmente',
				description: 'Guía completa sobre el uso de la Matriz de Eisenhower para la gestión de tareas. Aprenda a priorizar tareas y aumentar la productividad.',
			},
			zh: {
				title: '艾森豪威尔矩阵指南 | 如何有效管理任务',
				description: '使用艾森豪威尔矩阵进行任务管理的完整指南。了解如何确定任务优先级并提高生产力。',
			},
		},
		privacy: {
			ru: {
				title: 'Политика конфиденциальности | Матрица Эйзенхауэра',
				description: 'Политика конфиденциальности сайта todolist.su. Узнайте, как мы собираем, используем и защищаем ваши персональные данные.',
			},
			en: {
				title: 'Privacy Policy | Eisenhower Matrix',
				description: 'Privacy policy of todolist.su. Learn how we collect, use and protect your personal data.',
			},
			de: {
				title: 'Datenschutzerklärung | Eisenhower-Matrix',
				description: 'Datenschutzerklärung von todolist.su. Erfahren Sie, wie wir Ihre persönlichen Daten sammeln, verwenden und schützen.',
			},
			es: {
				title: 'Política de Privacidad | Matriz de Eisenhower',
				description: 'Política de privacidad de todolist.su. Conozca cómo recopilamos, utilizamos y protegemos sus datos personales.',
			},
			zh: {
				title: '隐私政策 | 艾森豪威尔矩阵',
				description: 'todolist.su 的隐私政策。了解我们如何收集、使用和保护您的个人数据。',
			},
		},
		terms: {
			ru: {
				title: 'Пользовательское соглашение | Матрица Эйзенхауэра',
				description: 'Пользовательское соглашение сайта todolist.su. Условия использования сервиса матрицы Эйзенхауэра.',
			},
			en: {
				title: 'Terms of Service | Eisenhower Matrix',
				description: 'Terms of service of todolist.su. Conditions for using the Eisenhower Matrix service.',
			},
			de: {
				title: 'Nutzungsbedingungen | Eisenhower-Matrix',
				description: 'Nutzungsbedingungen von todolist.su. Bedingungen für die Nutzung des Eisenhower-Matrix-Dienstes.',
			},
			es: {
				title: 'Términos de Servicio | Matriz de Eisenhower',
				description: 'Términos de servicio de todolist.su. Condiciones para usar el servicio de Matriz de Eisenhower.',
			},
			zh: {
				title: '服务条款 | 艾森豪威尔矩阵',
				description: 'todolist.su 的服务条款。使用艾森豪威尔矩阵服务的条件。',
			},
		},
		cookies: {
			ru: {
				title: 'Политика использования файлов cookie | Матрица Эйзенхауэра',
				description: 'Политика использования файлов cookie сайта todolist.su. Узнайте, какие cookies мы используем и как ими управлять.',
			},
			en: {
				title: 'Cookie Policy | Eisenhower Matrix',
				description: 'Cookie policy of todolist.su. Learn what cookies we use and how to manage them.',
			},
			de: {
				title: 'Cookie-Richtlinie | Eisenhower-Matrix',
				description: 'Cookie-Richtlinie von todolist.su. Erfahren Sie, welche Cookies wir verwenden und wie Sie sie verwalten.',
			},
			es: {
				title: 'Política de Cookies | Matriz de Eisenhower',
				description: 'Política de cookies de todolist.su. Conozca qué cookies utilizamos y cómo gestionarlas.',
			},
			zh: {
				title: 'Cookie 政策 | 艾森豪威尔矩阵',
				description: 'todolist.su 的 Cookie 政策。了解我们使用哪些 Cookie 以及如何管理它们。',
			},
		},
		about: {
			ru: {
				title: 'О нас | Матрица Эйзенхауэра',
				description: 'О проекте Матрица Эйзенхауэра. Узнайте больше о нашем бесплатном онлайн-планировщике задач.',
			},
			en: {
				title: 'About Us | Eisenhower Matrix',
				description: 'About the Eisenhower Matrix project. Learn more about our free online task planner.',
			},
			de: {
				title: 'Über uns | Eisenhower-Matrix',
				description: 'Über das Eisenhower-Matrix-Projekt. Erfahren Sie mehr über unseren kostenlosen Online-Aufgabenplaner.',
			},
			es: {
				title: 'Acerca de Nosotros | Matriz de Eisenhower',
				description: 'Acerca del proyecto Matriz de Eisenhower. Conozca más sobre nuestro planificador de tareas en línea gratuito.',
			},
			zh: {
				title: '关于我们 | 艾森豪威尔矩阵',
				description: '关于艾森豪威尔矩阵项目。了解更多关于我们的免费在线任务规划器。',
			},
		},
		contact: {
			ru: {
				title: 'Контакты | Матрица Эйзенхауэра',
				description: 'Свяжитесь с нами. Есть вопросы или предложения? Мы всегда рады обратной связи.',
			},
			en: {
				title: 'Contact Us | Eisenhower Matrix',
				description: 'Contact us. Have questions or suggestions? We are always happy to hear from you.',
			},
			de: {
				title: 'Kontakt | Eisenhower-Matrix',
				description: 'Kontaktieren Sie uns. Haben Sie Fragen oder Vorschläge? Wir freuen uns immer über Ihr Feedback.',
			},
			es: {
				title: 'Contáctenos | Matriz de Eisenhower',
				description: 'Contáctenos. ¿Tiene preguntas o sugerencias? Siempre estamos encantados de escuchar de usted.',
			},
			zh: {
				title: '联系我们 | 艾森豪威尔矩阵',
				description: '联系我们。有问题或建议吗？我们很高兴收到您的来信。',
			},
		},
		notFound: {
			ru: {
				title: '404 - Страница не найдена | Матрица Эйзенхауэра',
				description: 'Страница, которую вы ищете, не существует. Вернитесь на главную страницу.',
			},
			en: {
				title: '404 - Page Not Found | Eisenhower Matrix',
				description: 'The page you are looking for does not exist. Return to the home page.',
			},
			de: {
				title: '404 - Seite nicht gefunden | Eisenhower-Matrix',
				description: 'Die Seite, die Sie suchen, existiert nicht. Zurück zur Startseite.',
			},
			es: {
				title: '404 - Página no encontrada | Matriz de Eisenhower',
				description: 'La página que busca no existe. Volver a la página de inicio.',
			},
			zh: {
				title: '404 - 页面未找到 | 艾森豪威尔矩阵',
				description: '您要查找的页面不存在。返回首页。',
			},
		},
	};

	// Get current page metadata
	const getPageMetadata = () => {
		const page = pageMetadata[currentPage] || pageMetadata.home;
		return page[locale] || page.ru;
	};

	// Get current page URL
	const getCurrentPageUrl = () => {
		const baseUrl = 'https://todolist.su';
		if (currentPage === 'home') {
			return locale === 'ru' ? baseUrl : `${baseUrl}/${locale}/`;
		}
		return `${baseUrl}/${currentPage === 'seo' ? 'seo' : currentPage}`;
	};

	// Get page title for translations
	const getPageTitle = () => {
		const titles = {
			seo: t('pages.seoContent.title'),
			privacy: t('pages.privacy.title'),
			terms: t('pages.terms.title'),
			cookies: t('pages.cookies.title'),
			about: t('pages.about.title'),
			contact: t('pages.contact.title'),
			home: t('seo.title'),
		};
		return titles[currentPage] || titles.home;
	};

	// Update meta tags dynamically
	useEffect(() => {
		const metadata = getPageMetadata();
		const pageUrl = getCurrentPageUrl();

		// Update title
		document.title = metadata.title;

		// Update meta description
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute('content', metadata.description);
		}

		// Update canonical URL
		const updateCanonical = () => {
			const canonicalUrl = pageUrl;
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

		// Update Open Graph tags
		const updateOGTag = (property, content) => {
			let tag = document.querySelector(`meta[property="${property}"]`);
			if (!tag) {
				tag = document.createElement('meta');
				tag.setAttribute('property', property);
				document.head.appendChild(tag);
			}
			tag.setAttribute('content', content);
		};

		updateOGTag('og:title', metadata.title);
		updateOGTag('og:description', metadata.description);
		updateOGTag('og:url', pageUrl);
		updateOGTag('og:image', 'https://todolist.su/og-image.jpg');
		updateOGTag('og:image:alt', metadata.title);

		// Update Twitter Card tags
		const updateTwitterTag = (name, content) => {
			let tag = document.querySelector(`meta[name="${name}"]`);
			if (!tag) {
				tag = document.createElement('meta');
				tag.setAttribute('name', name);
				document.head.appendChild(tag);
			}
			tag.setAttribute('content', content);
		};

		updateTwitterTag('twitter:title', metadata.title);
		updateTwitterTag('twitter:description', metadata.description);
		updateTwitterTag('twitter:image', 'https://todolist.su/twitter-image.jpg');
		updateTwitterTag('twitter:image:alt', metadata.title);

		// Update og:locale
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

		// Update hreflang tags
		const hreflangTags = document.querySelectorAll(
			'link[rel="alternate"][hreflang]'
		);
		hreflangTags.forEach((tag) => {
			const hreflang = tag.getAttribute('hreflang');
			const baseUrl = 'https://todolist.su';
			let url = baseUrl;
			if (currentPage !== 'home') {
				url = `${baseUrl}/${currentPage === 'seo' ? 'seo' : currentPage}`;
			} else if (hreflang !== 'ru' && hreflang !== 'x-default') {
				url = `${baseUrl}/${hreflang}/`;
			}
			tag.setAttribute('href', url);
		});

		return () => {
			window.removeEventListener('hashchange', updateCanonical);
		};
	}, [locale, currentPage]);

	// Generate breadcrumbs for Schema
	const getBreadcrumbsSchema = () => {
		if (currentPage === 'home') {
			return [
				{
					'@type': 'ListItem',
					position: 1,
					name: t('seo.title') || 'Главная',
					item: 'https://todolist.su/',
				},
			];
		}
		return [
			{
				'@type': 'ListItem',
				position: 1,
				name: t('footer.quickLinks.home') || 'Главная',
				item: 'https://todolist.su/',
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: getPageTitle(),
				item: getCurrentPageUrl(),
			},
		];
	};

	return (
		<>
			{/* Скрытые семантические элементы для SEO */}
			<div style={{ display: 'none' }}>
				<h1>{getPageTitle()}</h1>
				{currentPage === 'home' && (
					<>
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
					</>
				)}
			</div>

			{/* WebSite Schema with SearchAction */}
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: t('seo.author'),
					url: 'https://todolist.su/',
					potentialAction: {
						'@type': 'SearchAction',
						target: {
							'@type': 'EntryPoint',
							urlTemplate: 'https://todolist.su/?q={search_term_string}',
						},
						'query-input': 'required name=search_term_string',
					},
					inLanguage: locale,
				})}
			</script>

			{/* WebPage Schema for current page */}
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'WebPage',
					name: getPageMetadata().title,
					description: getPageMetadata().description,
					url: getCurrentPageUrl(),
					inLanguage: locale,
					isPartOf: {
						'@type': 'WebSite',
						name: t('seo.author'),
						url: 'https://todolist.su/',
					},
					breadcrumb: {
						'@type': 'BreadcrumbList',
						itemListElement: getBreadcrumbsSchema(),
					},
					datePublished: '2024-01-15',
					dateModified: new Date().toISOString().split('T')[0],
				})}
			</script>

			{/* Article Schema for home page */}
			{currentPage === 'home' && (
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
								width: 600,
								height: 60,
							},
						},
						datePublished: '2024-01-15',
						dateModified: new Date().toISOString().split('T')[0],
						mainEntityOfPage: {
							'@type': 'WebPage',
							'@id': getCurrentPageUrl(),
						},
						image: {
							'@type': 'ImageObject',
							url: 'https://todolist.su/og-image.jpg',
							width: 1200,
							height: 630,
						},
						articleSection: t('seo.section'),
						keywords: t('seo.keywordsList'),
						inLanguage: locale,
					})}
				</script>
			)}

			{/* FAQ Schema - Extended with 15 questions */}
			{currentPage === 'home' || currentPage === 'seo' ? (
				<script type='application/ld+json'>
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'FAQPage',
						mainEntity: Array.from({ length: 15 }, (_, i) => ({
							'@type': 'Question',
							name:
								t(`pages.seoContent.faq.question${i + 1}`) ||
								t(`seo.faq${i + 1}.question`),
							acceptedAnswer: {
								'@type': 'Answer',
								text:
									t(`pages.seoContent.faq.answer${i + 1}`) ||
									t(`seo.faq${i + 1}.answer`),
							},
						})).filter((q) => q.name && q.acceptedAnswer.text),
						inLanguage: locale,
					})}
				</script>
			) : null}

			{/* HowTo Schema */}
			{currentPage === 'home' || currentPage === 'seo' ? (
				<script type='application/ld+json'>
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'HowTo',
						name:
							t('pages.seoContent.howTo.title') || t('seo.howToUse'),
						description:
							t('pages.seoContent.howTo.section1.content') ||
							t('seo.description'),
						step: [
							{
								'@type': 'HowToStep',
								position: 1,
								name:
									t('pages.seoContent.howTo.section1.step1') ||
									t('seo.step1'),
								text:
									t('pages.seoContent.howTo.section1.step1') ||
									t('seo.step1'),
							},
							{
								'@type': 'HowToStep',
								position: 2,
								name:
									t('pages.seoContent.howTo.section1.step2') ||
									t('seo.step2'),
								text:
									t('pages.seoContent.howTo.section1.step2') ||
									t('seo.step2'),
							},
							{
								'@type': 'HowToStep',
								position: 3,
								name:
									t('pages.seoContent.howTo.section1.step3') ||
									t('seo.step3'),
								text:
									t('pages.seoContent.howTo.section1.step3') ||
									t('seo.step3'),
							},
							{
								'@type': 'HowToStep',
								position: 4,
								name:
									t('pages.seoContent.howTo.section1.step4') ||
									t('seo.step4'),
								text:
									t('pages.seoContent.howTo.section1.step4') ||
									t('seo.step4'),
							},
							{
								'@type': 'HowToStep',
								position: 5,
								name:
									t('pages.seoContent.howTo.section1.step5') ||
									t('seo.step5'),
								text:
									t('pages.seoContent.howTo.section1.step5') ||
									t('seo.step5'),
							},
						],
						totalTime: 'PT30M',
						inLanguage: locale,
					})}
				</script>
			) : null}

			{/* Breadcrumbs Schema */}
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: getBreadcrumbsSchema(),
				})}
			</script>

			{/* Organization Schema */}
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'Organization',
					name: t('seo.author'),
					url: 'https://todolist.su/',
					logo: {
						'@type': 'ImageObject',
						url: 'https://todolist.su/logo.png',
						width: 600,
						height: 60,
					},
					sameAs: [],
					contactPoint: {
						'@type': 'ContactPoint',
						contactType: 'Customer Service',
						availableLanguage: ['ru', 'en', 'de', 'es', 'zh'],
					},
				})}
			</script>

			{/* AggregateRating Schema */}
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'AggregateRating',
					itemReviewed: {
						'@type': 'WebApplication',
						name: t('seo.author'),
						url: 'https://todolist.su/',
					},
					ratingValue: '4.8',
					reviewCount: '150',
					bestRating: '5',
					worstRating: '1',
				})}
			</script>

			{/* SoftwareApplication Schema */}
			{currentPage === 'home' && (
				<script type='application/ld+json'>
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'SoftwareApplication',
						name: t('seo.author'),
						applicationCategory: 'ProductivityApplication',
						operatingSystem: 'Web Browser',
						offers: {
							'@type': 'Offer',
							price: '0',
							priceCurrency: 'RUB',
						},
						aggregateRating: {
							'@type': 'AggregateRating',
							ratingValue: '4.8',
							reviewCount: '150',
							bestRating: '5',
							worstRating: '1',
						},
						screenshot: {
							'@type': 'ImageObject',
							url: 'https://todolist.su/screenshot.jpg',
							width: 1920,
							height: 1080,
						},
						softwareVersion: '1.0.0',
						inLanguage: locale,
					})}
				</script>
			)}
		</>
	);
};

export default SemanticStructure;
