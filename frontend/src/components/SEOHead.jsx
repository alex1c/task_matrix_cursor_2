import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
	title = 'Матрица Эйзенхауэра - Управление задачами и приоритетами',
	description = 'Эффективное планирование задач с помощью матрицы Эйзенхауэра. Разделяйте задачи по важности и срочности. Бесплатный онлайн-планировщик для повышения продуктивности.',
	keywords = 'матрица эйзенхауэра, управление задачами, планирование, приоритеты, продуктивность, тайм-менеджмент, планировщик задач',
	image = 'https://eisenhower-matrix.ru/og-image.jpg',
	url = 'https://eisenhower-matrix.ru/',
	type = 'website',
}) => {
	// Обновляем заголовок страницы
	useEffect(() => {
		document.title = title;
	}, [title]);

	return (
		<Helmet>
			{/* Основные мета-теги */}
			<title>{title}</title>
			<meta
				name='description'
				content={description}
			/>
			<meta
				name='keywords'
				content={keywords}
			/>
			<link
				rel='canonical'
				href={url}
			/>

			{/* Open Graph */}
			<meta
				property='og:type'
				content={type}
			/>
			<meta
				property='og:title'
				content={title}
			/>
			<meta
				property='og:description'
				content={description}
			/>
			<meta
				property='og:url'
				content={url}
			/>
			<meta
				property='og:image'
				content={image}
			/>
			<meta
				property='og:image:width'
				content='1200'
			/>
			<meta
				property='og:image:height'
				content='630'
			/>
			<meta
				property='og:image:alt'
				content={title}
			/>
			<meta
				property='og:site_name'
				content='Матрица Эйзенхауэра'
			/>
			<meta
				property='og:locale'
				content='ru_RU'
			/>

			{/* Twitter Card */}
			<meta
				name='twitter:card'
				content='summary_large_image'
			/>
			<meta
				name='twitter:title'
				content={title}
			/>
			<meta
				name='twitter:description'
				content={description}
			/>
			<meta
				name='twitter:image'
				content={image}
			/>
			<meta
				name='twitter:image:alt'
				content={title}
			/>

			{/* Дополнительные мета-теги */}
			<meta
				name='theme-color'
				content='#3b82f6'
			/>
			<meta
				name='msapplication-TileColor'
				content='#3b82f6'
			/>
			<meta
				name='apple-mobile-web-app-title'
				content='Матрица Эйзенхауэра'
			/>
		</Helmet>
	);
};

export default SEOHead;
