import React from 'react'
import { useTranslations } from '../../context/I18nContext'

/**
 * Simple 404 page for unknown hash routes.
 * Kept lightweight to restore a missing module referenced by App.jsx.
 */
function NotFound ({ onBack }) {
	const { t } = useTranslations()

	return (
		<section className='max-w-3xl mx-auto px-4 py-12 text-center'>
			<h1 className='text-3xl font-bold mb-4'>404</h1>
			<p className='text-lg opacity-80 mb-8'>
				{t('notFound.message') || 'Страница не найдена'}
			</p>
			<button
				type='button'
				onClick={onBack}
				className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700'
			>
				{t('notFound.back') || 'На главную'}
			</button>
		</section>
	)
}

export default NotFound
