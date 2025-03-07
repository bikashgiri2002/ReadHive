import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/books">Books</Link>
      {user ? (
        <>
          {user.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
          {user.role === "student" && <Link to="/student">Student Dashboard</Link>}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
