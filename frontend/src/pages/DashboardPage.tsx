import { useAuth } from "../AuthContext";

export const DashboardPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6 bg-white border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name}!</h2>
            <p className="mt-2 text-gray-600">
              Select Projects from the navigation bar to get started. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
