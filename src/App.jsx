import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1 className="text-4xl font-bold text-green-500">Home Page</h1>} />
      <Route path="/login" element={<h1 className="text-4xl font-bold text-blue-500">Login Page</h1>} />
      <Route path="/register" element={<h1 className="text-4xl font-bold text-purple-500">Register Page</h1>} />
    </Routes>
  );
}

export default App;
