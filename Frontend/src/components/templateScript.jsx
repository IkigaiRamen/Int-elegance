import { useEffect } from 'react';

const TemplateScript = () => {
    useEffect(() => {
        const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
        const toggleHcSwitch = document.querySelector('.theme-high-contrast input[type="checkbox"]');
        const currentTheme = localStorage.getItem('theme');

        if (toggleSwitch && toggleHcSwitch) {
            if (currentTheme) {
                document.documentElement.setAttribute('data-theme', currentTheme);

                if (currentTheme === 'dark') {
                    toggleSwitch.checked = true;
                }
                if (currentTheme === 'high-contrast') {
                    toggleHcSwitch.checked = true;
                    toggleSwitch.checked = false;
                }
            }

            const switchTheme = (e) => {
                if (e.target.checked) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                    toggleHcSwitch.checked = false; // Ensure high-contrast is turned off
                } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                    localStorage.setItem('theme', 'light');
                }
            };

            toggleSwitch.addEventListener('change', switchTheme);

            // Cleanup to remove the event listener when component unmounts
            return () => {
                toggleSwitch.removeEventListener('change', switchTheme);
            };
        }
    }, []); // Empty dependency array ensures this runs once on mount

    return null; // This component doesn't render any JSX
};

export default TemplateScript;
