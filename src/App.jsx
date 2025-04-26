import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar'; // ✅ Import Navbar
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SelectInterests from './pages/SelectInterests'; // 👈 import SelectInterests


function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ Show Navbar on all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-interests" element={<SelectInterests />} /> 
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
