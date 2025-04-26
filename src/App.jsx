import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SelectInterests from './pages/SelectInterests'; 
import SuggestedUsers from './pages/SuggestedUsers'; // ✅ Add this!
import Navbar from './components/Navbar'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-interests" element={<SelectInterests />} /> 
        <Route path="/suggested" element={<SuggestedUsers />} /> {/* ✅ Now this works */}
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
