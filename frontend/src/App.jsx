import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Matrix from './components/Matrix';
import Statistics from './components/Statistics';
import TaskModal from './components/TaskModal';
import ShareBlock from './components/ShareBlock';
import AuthorContact from './components/AuthorContact';
import SEOHead from './components/SEOHead';
import SemanticStructure from './components/SemanticStructure';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';

function AppContent() {
	const { theme, isDark } = useTheme();

	return (
		<>
			<SEOHead />
			<SemanticStructure />
			<div
				className={`min-h-screen transition-all duration-300 theme-${theme}`}
			>
				<div className='container mx-auto px-4 py-6'>
					<Header />
					<Matrix />
					<Statistics />
					<ShareBlock />
					<AuthorContact />
				</div>
				<TaskModal />
			</div>
		</>
	);
}

function App() {
	return (
		<HelmetProvider>
			<ThemeProvider>
				<TaskProvider>
					<AppContent />
				</TaskProvider>
			</ThemeProvider>
		</HelmetProvider>
	);
}

export default App;
