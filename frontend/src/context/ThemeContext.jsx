import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState('standard'); // standard, retro, neon
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		// Загружаем сохраненные настройки темы
		const savedTheme = localStorage.getItem('theme') || 'standard';
		const savedDarkMode = localStorage.getItem('darkMode') === 'true';

		setTheme(savedTheme);
		setIsDark(savedDarkMode);

		// Применяем темную тему к body
		if (savedDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, []);

	const toggleDarkMode = () => {
		const newDarkMode = !isDark;
		setIsDark(newDarkMode);
		localStorage.setItem('darkMode', newDarkMode.toString());

		if (newDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};

	const changeTheme = (newTheme) => {
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
	};

	const value = {
		theme,
		isDark,
		toggleDarkMode,
		changeTheme,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

