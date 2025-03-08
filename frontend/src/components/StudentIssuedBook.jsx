import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const StudentIssuedBook = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [books, setBooks] = useState([]);
  const token = localStorage.getItem("token");
  let studentId = "";
  if (!token) {
    console.error("No token found. Please log in.");
  } else {
    const decodedToken = jwtDecode(token);
    studentId = decodedToken.id || decodedToken._id;
  }
  const API_BASE_URL = "http://localhost:5000/api";
  // fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/books`);
        setBooks(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };
    if(error){
        console.error(error);
    }
    const fetchBorrowedBooks = async (studentId) => {
      try {
        const res = await axios.get(`${API_BASE_URL}/borrows/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBorrowedBooks(res.data.borrows);
      } catch (err) {
        console.error("Error fetching borrowed books:", err);
        setBorrowedBooks([]);
      }
    };
    fetchBooks();
    fetchBorrowedBooks(studentId);
  }, []);

    console.log("borrowed Books",borrowedBooks);
    console.log("books : ", books);
    
  const getBookName = (bookId) => {
    const book = books.find((b) => b._id === bookId);
    return book;
  };
  

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Available Books
      </h1>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-center text-lg text-red-500">No books available.</p>
      ) : (
        <ul className="divide-y divide-gray-300">
          {borrowedBooks.map((book) => (
            <li
              key={book._id}
              className="p-4 bg-gray-100 rounded-md shadow-md mb-4"
            >
              <p className="text-lg font-semibold">
                {getBookName(book.bookId).title}
              </p>
              <p className="text-gray-600">by {getBookName(book.bookId).author}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentIssuedBook;
