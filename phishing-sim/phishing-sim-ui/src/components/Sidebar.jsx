import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold border-b pb-4">PhishingSim</h1>
      <nav className="flex flex-col space-y-4">
        <Link to="/dashboard" className="hover:text-blue-300 transition">Dashboard</Link>
        <Link to="/send-email" className="hover:text-blue-300 transition">Send Email</Link>
      
      </nav>
    </div>
  );
};

export default Sidebar;
