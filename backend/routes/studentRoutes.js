const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const auth = require("../middleware/auth");

const router = express.Router();

// Student login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student by email
    const student = await User.findOne({ email, role: "student" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Check password
    const isMatch = password === student.password;
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ id: student._id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Get all available books
router.get("/books", auth, async (req, res) => {
  try {
    const books = await Book.find({ quantity: { $gt: 0 } });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

// Get books borrowed by a student
router.get("/borrowed", auth, async (req, res) => {
  try {
    const borrows = await Borrow.find({ studentId: req.user.id, returnStatus: false }).populate("bookId", "title author");
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching borrowed books", error });
  }
});

module.exports = router;
