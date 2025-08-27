import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Matrix from './components/Matrix';
import Statistics from './components/Statistics';
import TaskModal from './components/TaskModal';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';

function AppContent() {
	const { theme, isDark } = useTheme();

	return (
		<div
			className={`min-h-screen transition-all duration-300 theme-${theme}`}
		>
			<div className='container mx-auto px-4 py-6'>
				<Header />
				<Matrix />
				<Statistics />
			</div>
			<TaskModal />
		</div>
	);
}

function App() {
	return (
		<ThemeProvider>
			<TaskProvider>
				<AppContent />
			</TaskProvider>
		</ThemeProvider>
	);
}

export default App;
