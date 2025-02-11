import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Hardcoded attendance data
  const attendanceData = {
    total: 100,
    present: 85,
    percentage: 85
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        console.log('Attempting to fetch dashboard data...');
        
        const response = await axios({
          method: 'GET',
          url: 'http://localhost:5000/api/dashboard',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response:', response);

        if (response.data) {
          setDashboardData(response.data);
          setLoading(false);
        } else {
          throw new Error('No data received');
        }
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response,
          status: err.response?.status
        });
        
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        setLoading(false);
        
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-800">
                Student<span className="text-blue-600">Portal</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {dashboardData?.user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dashboardData && (
          <div className="space-y-8">
            {/* Existing grid with user info and profile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Info Card */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Name:</span>
                      <span className="text-gray-800 font-medium">{dashboardData.user?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-800 font-medium">{dashboardData.user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Status Card */}
              {!dashboardData.profileComplete ? (
                <div className="bg-yellow-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-yellow-100">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-yellow-800">Profile Incomplete</h2>
                      <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-yellow-700 mb-4">Please complete your profile to access all features.</p>
                    <button 
                      onClick={() => navigate("/profile")} 
                      className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>Complete Profile</span>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                      <button
                        onClick={() => navigate("/profile")}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Student ID</p>
                        <p className="font-medium">{dashboardData.profile?.studentId}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{dashboardData.profile?.contactNumber}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{dashboardData.profile?.gender}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">
                          {new Date(dashboardData.profile?.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Academic Performance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Attendance Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Overview</h2>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                        Attendance Rate
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-green-600">
                        {attendanceData.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                    <div 
                      style={{ width: `${attendanceData.percentage}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Present: {attendanceData.present} days</p>
                    <p>Total Classes: {attendanceData.total} days</p>
                  </div>
                </div>
              </div>

              {/* Grades Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Academic Performance</h2>
                {dashboardData.profile?.marks && 
                 Object.values(dashboardData.profile.marks).some(mark => mark !== null) ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(dashboardData.profile.marks).map(([subject, marks]) => (
                        <div key={subject} className="space-y-1">
                          <p className="text-sm text-gray-500 capitalize">{subject}</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-grow bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  marks >= 90 ? 'bg-green-500' :
                                  marks >= 70 ? 'bg-blue-500' :
                                  marks >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${marks}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{marks}/100</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-600">Average Score</p>
                          <p className="text-2xl font-bold text-gray-800">
                            {dashboardData.profile.average}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">Grade</p>
                          <p className={`text-3xl font-bold ${
                            dashboardData.profile.grade === 'A+' ? 'text-green-600' :
                            dashboardData.profile.grade === 'A' ? 'text-green-500' :
                            dashboardData.profile.grade === 'B' ? 'text-blue-500' :
                            dashboardData.profile.grade === 'C' ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>
                            {dashboardData.profile.grade || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No grades available yet</p>
                    <button 
                      onClick={() => navigate("/profile")} 
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add Grades
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
