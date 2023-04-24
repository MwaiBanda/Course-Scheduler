import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import CoursesPage from './pages/CoursesPage'
import TeachersPage from './pages/TeachersPage';
import TopNavBar from './components/Navbar';

function App() {

  return (
    <>
    <TopNavBar/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoursesPage />}></Route>
        <Route path="/teachers" element={<TeachersPage />}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
