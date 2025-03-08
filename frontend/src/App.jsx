import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Install using: npm install jwt-decode
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Books from "./pages/Books";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import AddStudent from "./components/AddStudent";
import AddBook from "./components/AddBook";
import IssueBook from "./components/IssueBook";
import AllStudents from "./pages/AllStudents";
import ReturnBookForm from "./components/ReturnBookForm"; // Import the new component
import StudentIssuedBook from "./components/StudentIssuedBook";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = jwtDecode(token); // Decode JWT safely
        setUser(userData);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token"); // Remove invalid token
      }
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Navigate to="/books" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/books" element={<Books />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/add-student"
          element={user?.role === "admin" ? <AddStudent /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/add-book"
          element={user?.role === "admin" ? <AddBook /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/issue-book"
          element={user?.role === "admin" ? <IssueBook /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/students"
          element={user?.role === "admin" ? <AllStudents /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/return-book"
          element={user?.role === "admin" ? <ReturnBookForm /> : <Navigate to="/login" />}
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={user?.role === "student" ? <StudentDashboard /> : <Navigate to="/login" />}
        />
        {/* Student issued books */}
        <Route
          path="/student/issued-books"
          element={user?.role === "student" ? <StudentIssuedBook /> : <Navigate to="/login" /> }
          />
      </Routes>
    </Router>
  );
}

export default App;
