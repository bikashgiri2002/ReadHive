const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Book = require("../models/Book");
const Borrow = require("../models/Borrow");
const auth = require("../middleware/auth");

const router = express.Router();

// Admin login (Static credentials from .env)
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ message: "Admin authenticated", token });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// Get all students (Admin only)
router.get("/students", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    // Fetch all students
    const students = await User.find({ role: "student" }).select("-password").lean(); // Exclude password

    // Fetch borrow details for each student
    for (let student of students) {
      const borrows = await Borrow.find({ studentId: student._id, returnStatus: false })
        .populate("bookId", "title author"); // Include book details

      student.borrowedBooks = borrows; // Attach borrowed books to student object
    }

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

// Add a new student (Admin only)
router.post("/students", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, password, department, regdNo } = req.body;

    // 🔍 Check if email already exists
    const existingStudent = await User.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new User({ name, email, password: hashedPassword, department, regdNo, role: "student" });
    await student.save();

    res.json({ message: "Student added successfully", student });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Error adding student", error });
  }
});



// Add a new book (Admin only)
router.post("/books", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const book = new Book(req.body);
    await book.save();
    res.json({ message: "Book added successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error });
  }
});

// Issue a book to a student (Admin only)
router.post("/issue", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const { studentId, bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.quantity <= 0) return res.status(400).json({ message: "Book not available" });

    book.quantity -= 1;
    await book.save();

    const borrow = new Borrow({ studentId, bookId });
    await borrow.save();

    res.json({ message: "Book issued successfully", borrow });
  } catch (error) {
    res.status(500).json({ message: "Error issuing book", error });
  }
});

// Return a book (Admin only)
router.post("/return", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const { borrowId } = req.body;
    const borrow = await Borrow.findById(borrowId);
    if (!borrow || borrow.returnStatus) return res.status(400).json({ message: "Invalid borrow record" });

    borrow.returnStatus = true;
    borrow.returnDate = new Date();
    await borrow.save();

    const book = await Book.findById(borrow.bookId);
    if (book) {
      book.quantity += 1;
      await book.save();
    }

    res.json({ message: "Book returned successfully", borrow });
  } catch (error) {
    res.status(500).json({ message: "Error returning book", error });
  }
});

module.exports = router;
