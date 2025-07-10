import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Authentication/login';
import Register from './components/Authentication/register';
import Profile from './components/profile/profile';
import Layout from './components/layout';
import Projects from './components/Projects/projects';
import Tasks from './components/Tasks/tasks';
import ProjectForm from './components/Projects/projectForm';
import TemplateScript from './Scripts/TemplateScript';
import ProjectTaskLayout from './components/Projects/Tasks/projectTaskLayout';
import KanbanTest from './components/Projects/Tasks/KanbanBoard/taskkanbantest';
import CreateCompany from './components/Company/CreateCompany';
import CompanyEmployees from './components/Company/CompanyEmployees';
import CompanyPreview from './components/Company/CompanyPreview';
import SearchUsers from './components/Search/SearchUsers';
import UserProfile from './components/Search/UserProfile';
import RoleSelection from './components/Authentication/role';
import FirstTimeProfile from './components/Authentication/FirstTimeProfile';
import FirstTimeCompany from './components/Authentication/FirstTimeCompany';  
import TaskDetails from './components/Projects/Tasks/TaskDetails';
import EmailVerification from './components/Authentication/EmailVerification';
import TaskCards from './components/Projects/Tasks/Task Cards/taskCards';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import MyTasks from './components/profile/tasks/mytasks';
import './App.css';
import { registerLicense } from '@syncfusion/ej2-base';
import Gantt from './components/Projects/Tasks/Gantt diagram/Gantt';
import CompanyComponent from './components/Company/CompanyProfile';
import ProjectCalendar from './components/Calendar/projectCalendar';
import ChatLayout from './components/Chat/ChatLayout';
import ChatB from './components/Chat/Chat';
import { GoogleOAuthProvider } from "@react-oauth/google";
import Friends from './components/Friends/Friends';
registerLicense("Ngo9BigBOggjHTQxAR8/V1NDaF1cWWhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFiWHxecXVQRWRZUEF/Xw==");


const AppContent = () => {
  const location = useLocation();

  // Define paths to exclude from the layout
  const layoutExcludedPaths = ['/login', '/register', '/role', '/FirstTime', '/FirstTimeCompany', '/VerifyEmail','/chat'];

  // Check if the current path should exclude the layout
  const isLayoutExcluded = layoutExcludedPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {!isLayoutExcluded ? (
        <Layout>
          <TemplateScript />
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/projects/create" element={<ProjectForm />} />
            <Route path="/kanban" element={<KanbanTest />} />
            <Route path="/CreateCompany" element={<CreateCompany />} />
            <Route path="/Company/Employees" element={<CompanyEmployees />} />
            <Route path="/Company/Profile" element={<CompanyPreview />} />
            <Route path="/search-users" element={<SearchUsers />} /> 
            <Route path="/profile/:userId" element={<UserProfile />} /> 
            <Route path="/company/:companyId" element={<CompanyComponent />} />
            <Route path="/task/:taskId" element={<TaskDetails />} />
            <Route path="/projecttasks/:projectId" element={<ProjectTaskLayout />} />
            <Route path="/project/tasks/:projectId" element={<TaskCards />}/>
            <Route path="/project/Gantt/:projectId" element={<Gantt />} />
            <Route path="/my-tasks" element={<MyTasks/>}/>
            <Route path="/calendar" element={<ProjectCalendar/>}/>
            <Route path="/chatb" element={<ChatB />} />
            <Route path="/friends" element={<Friends />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/role" element={<RoleSelection />} />
          <Route path="/FirstTime" element={<FirstTimeProfile />} />
          <Route path="/FirstTimeCompany" element={<FirstTimeCompany />} />
          <Route path="/VerifyEmail" element={<EmailVerification />} />
          <Route path="/chat" element={<ChatLayout />} />
        </Routes>
      )}
    </>
  );
};

const App = () => {
  const [themeColor, setThemeColor] = useState('theme-indigo'); // Default theme

  useEffect(() => {
    document.body.setAttribute('data-mytask', themeColor);
  }, [themeColor]);

  return (
    <Router>
      <GoogleOAuthProvider clientId="956795060962-mi9ksasd1vak12l93siihfspuhusjh2s.apps.googleusercontent.com">
      <AppContent />
      <ToastContainer />
      </GoogleOAuthProvider>
    </Router>
  );
};

export default App;
