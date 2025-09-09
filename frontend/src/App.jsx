import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Matrix from './components/Matrix';
import Statistics from './components/Statistics';
import ServiceInfo from './components/ServiceInfo';
import TaskModal from './components/TaskModal';
import ShareBlock from './components/ShareBlock';
import AuthorContact from './components/AuthorContact';
import SemanticStructure from './components/SemanticStructure';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import { useTheme } from './context/ThemeContext';

function AppContent() {
	const { theme, isDark } = useTheme();

	return (
		<>
			<SemanticStructure />
			<div
				className={`min-h-screen transition-all duration-300 theme-${theme}`}
			>
				<div className='container mx-auto px-4 py-6'>
					<Header />
					<Matrix />
					<Statistics />
					<ServiceInfo />
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
