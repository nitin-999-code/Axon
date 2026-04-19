import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { LayoutDashboard, LogOut } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6" />
                Axon
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/projects" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Projects
                </Link>
              </div>
            )}
          </div>
          {user && (
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
