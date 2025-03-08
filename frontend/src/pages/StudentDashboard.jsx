import Books from "./Books";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
      <Books />
    </div>
  );
};

export default StudentDashboard;
