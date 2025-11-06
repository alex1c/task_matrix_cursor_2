import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Matrix from './components/Matrix';
import Statistics from './components/Statistics';
import ServiceInfo from './components/ServiceInfo';
import TaskModal from './components/TaskModal';
import ShareBlock from './components/ShareBlock';
import SemanticStructure from './components/SemanticStructure';
import Breadcrumbs from './components/Breadcrumbs';
import SEOContent from './components/pages/SEOContent';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsOfService from './components/pages/TermsOfService';
import CookiePolicy from './components/pages/CookiePolicy';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import NotFound from './components/pages/NotFound';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import { useTheme } from './context/ThemeContext';

function AppContent() {
	const { theme, isDark } = useTheme();
	const [currentPage, setCurrentPage] = useState('home');

	// Handle hash routing
	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash.slice(1) || '/';
			setCurrentPage(hash === '/' ? 'home' : hash.slice(1));
		};

		// Initial load
		handleHashChange();

		// Listen for hash changes
		window.addEventListener('hashchange', handleHashChange);

		return () => {
			window.removeEventListener('hashchange', handleHashChange);
		};
	}, []);

	const handleNavigate = (path) => {
		if (path === '/') {
			window.location.hash = '';
			setCurrentPage('home');
		} else {
			window.location.hash = path;
			setCurrentPage(path.slice(1));
		}
	};

	const handleBack = () => {
		window.location.hash = '';
		setCurrentPage('home');
	};

	// Valid pages list
	const validPages = ['seo', 'guide', 'privacy', 'terms', 'cookies', 'about', 'contact', 'home'];

	// Render page based on current route
	const renderPage = () => {
		// Show 404 for unknown pages (except home)
		if (currentPage !== 'home' && !validPages.includes(currentPage)) {
			return <NotFound onBack={handleBack} />;
		}

		switch (currentPage) {
			case 'seo':
			case 'guide':
				return <SEOContent onBack={handleBack} />;
			case 'privacy':
				return <PrivacyPolicy onBack={handleBack} />;
			case 'terms':
				return <TermsOfService onBack={handleBack} />;
			case 'cookies':
				return <CookiePolicy onBack={handleBack} />;
			case 'about':
				return <About onBack={handleBack} />;
			case 'contact':
				return <Contact onBack={handleBack} />;
			case 'home':
			default:
				return (
					<>
						<Matrix />
						<Statistics />
						<ServiceInfo />
						<ShareBlock />
					</>
				);
		}
	};

	return (
		<>
			<SemanticStructure currentPage={currentPage} />
			<div
				className={`min-h-screen transition-all duration-300 theme-${theme} flex flex-col`}
			>
				<div className='container mx-auto px-4 py-6 flex-grow'>
					<Header />
					<Breadcrumbs currentPage={currentPage} />
					{renderPage()}
				</div>
				<Footer onNavigate={handleNavigate} />
				<TaskModal />
			</div>
		</>
	);
}

function App() {
	return (
		<I18nProvider>
			<ThemeProvider>
				<TaskProvider>
					<AppContent />
				</TaskProvider>
			</ThemeProvider>
		</I18nProvider>
	);
}

export default App;
