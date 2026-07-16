import './App.css';
import {Routes, Route} from 'react-router-dom';
import Login from './features/login';
import Register from './features/register';
import Navbar from './features/navbar';
import HomePage from './features/homePage';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
