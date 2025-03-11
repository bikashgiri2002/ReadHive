import Books from "./Books";

const AdminDashboard = () => {
  return (
    // Admin dashboard component goes here...
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Admin Dashboard
      </h1>
      <Books />
    </div>
  );
};

export default AdminDashboard;
