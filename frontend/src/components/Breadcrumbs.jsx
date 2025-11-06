import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslations } from '../context/I18nContext';

const Breadcrumbs = ({ currentPage }) => {
	const { t } = useTranslations();

	// Page titles mapping
	const pageTitles = {
		seo: t('pages.seoContent.title') || 'Руководство',
		guide: t('pages.seoContent.title') || 'Руководство',
		privacy: t('pages.privacy.title') || 'Политика конфиденциальности',
		terms: t('pages.terms.title') || 'Пользовательское соглашение',
		cookies: t('pages.cookies.title') || 'Политика использования файлов cookie',
		about: t('pages.about.title') || 'О нас',
		contact: t('pages.contact.title') || 'Контакты',
	};

	// Don't show breadcrumbs for 404 or home
	if (currentPage === 'home' || !currentPage || !pageTitles[currentPage]) {
		return null;
	}

	const handleHomeClick = (e) => {
		e.preventDefault();
		window.location.hash = '';
	};

	return (
		<nav
			aria-label='Breadcrumb'
			className='mb-6'
			itemScope
			itemType='https://schema.org/BreadcrumbList'
		>
			<ol className='flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400'>
				<li
					itemProp='itemListElement'
					itemScope
					itemType='https://schema.org/ListItem'
				>
					<a
						href='/'
						onClick={handleHomeClick}
						itemProp='item'
						className='flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
					>
						<Home size={16} className='mr-1' />
						<span itemProp='name'>{t('footer.quickLinks.home') || 'Главная'}</span>
					</a>
					<meta itemProp='position' content='1' />
				</li>
				<li>
					<ChevronRight size={16} className='text-gray-400' />
				</li>
				<li
					itemProp='itemListElement'
					itemScope
					itemType='https://schema.org/ListItem'
					className='text-gray-900 dark:text-gray-100 font-medium'
				>
					<span itemProp='name'>{pageTitles[currentPage] || currentPage}</span>
					<meta itemProp='position' content='2' />
				</li>
			</ol>
		</nav>
	);
};

export default Breadcrumbs;

