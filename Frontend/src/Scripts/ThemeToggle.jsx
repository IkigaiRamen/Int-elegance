const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
  
    useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        setIsDarkMode(savedTheme === 'dark');
      }
    }, []);
  
    const handleThemeChange = (e) => {
      const newTheme = e.target.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    };
  
    return (
      <div>
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={handleThemeChange}
          id="theme-switch"
        />
        <label htmlFor="theme-switch">Dark Mode</label>
      </div>
    );
  };
  
  export default ThemeToggle;
  