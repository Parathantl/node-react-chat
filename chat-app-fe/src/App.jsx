import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { getToken } from './utils/auth';

function App() {
  const isLoggedIn = !!getToken();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            isLoggedIn ? <Dashboard /> : <Login />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
