import React from 'react';
import { FileText, Shield, Cookie, Info, Mail, Home } from 'lucide-react';
import { useTranslations } from '../context/I18nContext';

const Footer = ({ onNavigate }) => {
	const { t, locale } = useTranslations();

	// Debug: log current locale and translations
	React.useEffect(() => {
		const aboutTitle = t('footer.about.title');
		const legalTitle = t('footer.legal.title');
		const contactTitle = t('footer.contact.title');
		console.log(`[Footer] Rendering with locale: ${locale}`, {
			aboutTitle,
			legalTitle,
			contactTitle,
			isKey: aboutTitle === 'footer.about.title',
			allMessagesKeys: Object.keys(t('footer') || {}),
		});
	}, [locale, t]);

	const handleLinkClick = (path) => {
		if (onNavigate) {
			onNavigate(path);
		} else {
			// Fallback to hash routing
			window.location.hash = path;
		}
	};

	return (
		<footer className='mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'>
			<div className='container mx-auto px-4 py-8'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
					{/* О сайте */}
					<div>
						<h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
							{t('footer.about.title')}
						</h3>
						<p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
							{t('footer.about.description')}
						</p>
						<button
							onClick={() => handleLinkClick('/about')}
							className='text-primary-600 dark:text-primary-400 hover:underline text-sm flex items-center gap-2 transition-colors'
						>
							<Info size={16} />
							{t('footer.about.link')}
						</button>
					</div>

					{/* Правовая информация */}
					<div>
						<h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
							{t('footer.legal.title')}
						</h3>
						<ul className='space-y-2'>
							<li>
								<button
									onClick={() => handleLinkClick('/privacy')}
									className='text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-2 transition-colors'
								>
									<Shield size={16} />
									{t('footer.legal.privacy')}
								</button>
							</li>
							<li>
								<button
									onClick={() => handleLinkClick('/terms')}
									className='text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-2 transition-colors'
								>
									<FileText size={16} />
									{t('footer.legal.terms')}
								</button>
							</li>
							<li>
								<button
									onClick={() => handleLinkClick('/cookies')}
									className='text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-2 transition-colors'
								>
									<Cookie size={16} />
									{t('footer.legal.cookies')}
								</button>
							</li>
						</ul>
					</div>

					{/* Контакты */}
					<div>
						<h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
							{t('footer.contact.title')}
						</h3>
						<ul className='space-y-2'>
							<li>
								<button
									onClick={() => handleLinkClick('/contact')}
									className='text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-2 transition-colors'
								>
									<Mail size={16} />
									{t('footer.contact.link')}
								</button>
							</li>
						</ul>
					</div>

					{/* Быстрые ссылки */}
					<div>
						<h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
							{t('footer.quickLinks.title')}
						</h3>
						<ul className='space-y-2'>
							<li>
								<button
									onClick={() => handleLinkClick('/')}
									className='text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-2 transition-colors'
								>
									<Home size={16} />
									{t('footer.quickLinks.home')}
								</button>
							</li>
							<li>
								<button
									onClick={() => handleLinkClick('/seo')}
									className='text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-2 transition-colors'
								>
									<Info size={16} />
									{t('footer.quickLinks.guide')}
								</button>
							</li>
						</ul>
					</div>
				</div>

				{/* Нижняя часть футера */}
				<div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
					<div className='flex flex-col md:flex-row justify-between items-center gap-4'>
						<p className='text-sm text-gray-600 dark:text-gray-400 text-center md:text-left'>
							{t('footer.copyright')}
						</p>
						<div className='flex gap-4 text-sm text-gray-600 dark:text-gray-400'>
							<span>{t('footer.allRightsReserved')}</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
