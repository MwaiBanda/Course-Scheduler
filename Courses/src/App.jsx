import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import CoursesPage from './pages/CoursesPage'
import TeachersPage from './pages/TeachersPage';
import SchedulePage from './pages/SchedulePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import URL404 from './pages/404Page';
import TopNavBar from './components/Navbar';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
           <TopNavBar/>
           <CoursesPage />
          </>
        }></Route>
        <Route path="*" element={<URL404 />}></Route>
        <Route path="/cart" element={
           <>
           <TopNavBar/>
           <CartPage />
          </>
        }></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/schedule" element={
          <>
          <TopNavBar/>
          <SchedulePage />
         </>
        }></Route>
        <Route path="/teachers" element={
          <>
          <TopNavBar/>
          <TeachersPage />
         </>
        }></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
