import { useEffect, useState } from "react";
import axios from "axios";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents(res.data);
      setFilteredStudents(res.data); // Default: show all students
      setIsFiltered(false);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotReturned = () => {
    const studentsWithPendingBooks = students.filter(
      (student) => student.borrowedBooks && student.borrowedBooks.length > 0
    );
    setFilteredStudents(studentsWithPendingBooks);
    setIsFiltered(true);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">All Students</h2>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={filterNotReturned}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Show Students Who Haven't Returned Books
        </button>

        {isFiltered && (
          <button
            onClick={() => setFilteredStudents(students)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Show All Students
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : filteredStudents.length === 0 ? (
        <p className="text-center text-lg text-red-500">No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Regd No</th>
                <th className="border px-4 py-2">Borrowed Books</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student._id} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} text-center`}>
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.email}</td>
                  <td className="border px-4 py-2">{student.department}</td>
                  <td className="border px-4 py-2">{student.regdNo}</td>
                  <td className="border px-4 py-2">
                    {student.borrowedBooks && student.borrowedBooks.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {student.borrowedBooks.map((book) => (
                          <li key={book._id}>{book.bookId.title} by {book.bookId.author}</li>
                        ))}
                      </ul>
                    ) : (
                      "No borrowed books"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllStudents;
