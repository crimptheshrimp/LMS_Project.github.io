import './App.css';
import {Routes, Route} from 'react-router-dom';
import Login from './features/login';
import Register from './features/register';
import Navbar from './features/navbar';
import HomePage from './features/homePage';
import AddCourse from './features/addCourse';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addCourse" element={<AddCourse />} />
      </Routes>
    </div>
  );
}

export default App;
