import { useEffect } from 'react';

const TemplateScript = () => {
  useEffect(() => {
    // Sidebar Toggle Logic
    const sidebarToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarMiniButton = document.querySelector('.sidebar-mini-btn');
    const chatlistToggle = document.querySelector('.chatlist-toggle');
    const themeSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

    // Sidebar Toggle (Mobile)
    sidebarToggle?.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebar.classList.remove('sidebar-mini');
    });

    // Sidebar Mini (Collapsed) Version
    sidebarMiniButton?.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-mini');
      sidebar.classList.remove('open');
    });

    // Chatlist Toggle
    chatlistToggle?.addEventListener('click', () => {
      const cardChat = document.querySelector('.card-chat');
      cardChat?.classList.toggle('open');
    });

    // RTL Mode Toggle (added in TemplateSetting)
    themeSwitch?.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('rtl_mode');
      } else {
        document.body.classList.remove('rtl_mode');
      }
    });

    // Cleanup
    return () => {
      
    };
  }, []);

  return null; // No need to render anything
};

export default TemplateScript;
