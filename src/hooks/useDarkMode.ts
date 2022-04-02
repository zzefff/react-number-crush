import { useState, useEffect } from 'react';

const useDarkMode = () => {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', darkModeListener)
        return () => {
            window.matchMedia('(prefers-color-scheme: dark)')
            .removeEventListener('change', darkModeListener)
        }
    });
    const darkModeListener = (e: MediaQueryListEventInit) => {
        setIsDark(!!e.matches)
    }
    return [isDark]
}

export default useDarkMode