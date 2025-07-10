import { useState, useEffect } from "react";

const TemplateSetting = () => {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(true); // Open by default
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const [themeColor, setThemeColor] = useState('theme-indigo'); // Default theme

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      console.log("Dark mode enabled");
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      console.log("Light mode enabled");
    }
  };

  // Handle RTL toggle
  const handleRtlToggle = () => {
    setIsRtl(!isRtl);
    if (!isRtl) {
      document.body.classList.add('rtl_mode');
      console.log("RTL mode enabled");
    } else {
      document.body.classList.remove('rtl_mode');
      console.log("RTL mode disabled");
    }
  };

  // Handle theme color change
  const handleThemeColorChange = (color) => {
    setThemeColor(color);
    document.body.setAttribute('data-mytask', color); // Change body attribute for theme color
    document.documentElement.style.setProperty('--mytask-theme-color', color); // Change CSS variable for theme color
    localStorage.setItem('themeColor', color); // Save the selected color to localStorage
    console.log(`Theme color changed to: ${color}`);
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const themeColor = localStorage.getItem('themeColor');

    console.log(`Initial theme: ${theme}`);
    console.log(`Saved theme color: ${themeColor}`);

    if (theme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }

    if (document.body.classList.contains('rtl_mode')) {
      setIsRtl(true);
    }

    if (themeColor) {
      setThemeColor(themeColor); // Set themeColor from localStorage
      document.documentElement.style.setProperty('--mytask-theme-color', themeColor);
      document.body.setAttribute('data-mytask', themeColor); // Update theme color in body attribute
    }
  }, []);

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  return (
    <div>
      {isOffcanvasOpen && (
        <div
          className="offcanvas offcanvas-end show"
          tabIndex="-1"
          id="offcanvas_setting"
          aria-labelledby="offcanvas_setting"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Template Setting</h5>
            <button
              type="button"
              className="btn-close"
              onClick={toggleOffcanvas}
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body d-flex flex-column">
            <div className="mb-4">
              <h6>Set Theme Color</h6>
              <ul className="choose-skin list-unstyled mb-0">
                <li
                  data-theme="PurpleHeart"
                  onClick={() => handleThemeColorChange("#6238B3")}
                  className={themeColor === "#6238B3" ? "active" : ""}
                >
                  <div style={{ backgroundColor: "#6238B3" }}></div>
                </li>
                <li
                  data-theme="ValenciaRed"
                  onClick={() => handleThemeColorChange("#D63B38")}
                  className={themeColor === "#D63B38" ? "active" : ""}
                >
                  <div style={{ backgroundColor: "#D63B38" }}></div>
                </li>
                <li
                  data-theme="SunOrange"
                  onClick={() => handleThemeColorChange("#F7A614")}
                  className={themeColor === "#F7A614" ? "active" : ""}
                >
                  <div style={{ backgroundColor: "#F7A614" }}></div>
                </li>
                <li
                  data-theme="AppleGreen"
                  onClick={() => handleThemeColorChange("#5BC43A")}
                  className={themeColor === "#5BC43A" ? "active" : ""}
                >
                  <div style={{ backgroundColor: "#5BC43A" }}></div>
                </li>
                <li
                  data-theme="CeruleanBlue"
                  onClick={() => handleThemeColorChange("#00B8D6")}
                  className={themeColor === "#00B8D6" ? "active" : ""}
                >
                  <div style={{ backgroundColor: "#00B8D6" }}></div>
                </li>
                <li
                  data-theme="Mariner"
                  onClick={() => handleThemeColorChange("#0066FE")}
                  className={themeColor === "#0066FE" ? "active" : ""}
                >
                  <div style={{ backgroundColor: "#0066FE" }}></div>
                </li>
                <li
                  data-theme="FrenchRose"
                  onClick={() => handleThemeColorChange("#EB5393")}
                  className={themeColor === "#EB5393" ? "active" : ""}
                >
                  <div style={{ backgroundColor: "#EB5393" }}></div>
                </li>
              </ul>
            </div>
            <div className="mb-4 flex-grow-1">
              <h6>Set Theme Light/Dark/RTL</h6>
              <ul className="list-unstyled mb-0">
                <li>
                  <div className="form-check form-switch theme-switch">
                    <input
                      className="form-check-input fs-6"
                      type="checkbox"
                      role="switch"
                      id="theme-switch"
                      checked={isDarkMode}
                      onChange={handleDarkModeToggle}
                    />
                    <label className="form-check-label mx-2" htmlFor="theme-switch">
                      Enable Dark Mode!
                    </label>
                  </div>
                </li>
                <li>
                  <div className="form-check form-switch theme-rtl">
                    <input
                      className="form-check-input fs-6"
                      type="checkbox"
                      role="switch"
                      id="theme-rtl"
                      checked={isRtl}
                      onChange={handleRtlToggle}
                    />
                    <label className="form-check-label mx-2" htmlFor="theme-rtl">
                      Enable RTL Mode!
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSetting;
