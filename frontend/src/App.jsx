import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import Notifications from './pages/Notifications';
import Navbar from './components/Navbar';

function App() {
  localStorage.setItem('username', 'ranthilini');
  localStorage.setItem('userId', 1);
    return (
        <Router>
          <Navbar />
            <Routes>
              
                <Route path="/" element={<Home />} />
                <Route path="/post/:id" element={<PostDetails />} />
                <Route path="/notifications" element={<Notifications />} />
            </Routes>
        </Router>
    );
}

export default App;

