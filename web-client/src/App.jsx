import {AppRouting} from "./config/AppRouting.jsx";
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import Notifications from './pages/Notifications';
import Navbar from './components/Navbar';

function App() {

  return (
    <>
       <AppRouting/>
    </>
  )
}

export default App
