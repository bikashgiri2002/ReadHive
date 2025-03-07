import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Books from "./pages/Books";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      setUser(userData);
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Navigate to="/books" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/books" element={<Books />} />
        <Route path="/admin" element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/student" element={user?.role === "student" ? <StudentDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
