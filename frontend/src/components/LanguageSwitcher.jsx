import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslations } from '../context/I18nContext';

const LanguageSwitcher = () => {
	const { locale, locales, changeLocale } = useTranslations();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleLanguageChange = (newLocale) => {
		changeLocale(newLocale);
		setIsOpen(false);
	};

	return (
		<div
			className='relative'
			ref={dropdownRef}
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-soft hover:shadow-medium'
				title='Switch language'
			>
				<Globe
					size={16}
					className='text-gray-600 dark:text-gray-300'
				/>
				<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
					{locales[locale].flag} {locales[locale].name}
				</span>
				<ChevronDown
					size={14}
					className={`text-gray-500 transition-transform duration-200 ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</button>

			{isOpen && (
				<div className='absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50'>
					<div className='py-1'>
						{Object.entries(locales).map(
							([code, { name, flag }]) => (
								<button
									key={code}
									onClick={() => handleLanguageChange(code)}
									className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
										locale === code
											? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
											: 'text-gray-700 dark:text-gray-300'
									}`}
								>
									<span className='text-lg'>{flag}</span>
									<span className='font-medium'>{name}</span>
									{locale === code && (
										<span className='ml-auto text-blue-600 dark:text-blue-400'>
											✓
										</span>
									)}
								</button>
							)
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default LanguageSwitcher;
