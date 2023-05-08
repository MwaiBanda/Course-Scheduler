import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import CoursesPage from './pages/CoursesPage'
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import URL404 from './pages/404Page';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<URL404 />}></Route>
          <Route path="/courses" element={<CoursesPage isDisplayingSchedule={false}/>}></Route>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/schedule" element={<CoursesPage isDisplayingSchedule={true}/>}></Route>
          <Route path="/teachers" element={<UserPage isDisplayingFaculty={true}/>}></Route>
          <Route path="/students" element={<UserPage isDisplayingFaculty={false} />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
