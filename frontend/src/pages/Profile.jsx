import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = 'https://student-portal-qvyb.onrender.com/api';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    },
    marks: {
      mathematics: 0,
      science: 0,
      english: 0,
      history: 0
    }
  });

  // Fetch existing profile data if any
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data) {
          // Ensure marks object exists with default values
          const profileData = {
            ...response.data,
            marks: {
              mathematics: response.data.marks?.mathematics || 0,
              science: response.data.marks?.science || 0,
              english: response.data.marks?.english || 0,
              history: response.data.marks?.history || 0
            }
          };
          setForm(profileData);
          setIsUpdate(true);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setError("Error fetching profile data");
        }
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("marks.")) {
      const [parent, field] = name.split(".");
      setForm(prev => ({
        ...prev,
        marks: {
          ...prev.marks,
          [field]: value ? Number(value) : 0
        }
      }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateDateOfBirth = (dob) => {
    const dobDate = new Date(dob);
    const cutoffDate = new Date('2010-12-31');
    return dobDate <= cutoffDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate date of birth
    if (!validateDateOfBirth(form.dateOfBirth)) {
      setError("Date of birth must be before 2011");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/profile`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data) {
        alert(isUpdate ? "Profile updated successfully!" : "Profile created successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isUpdate ? "Update Your Profile" : "Complete Your Profile"}
        </h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="studentId"
                placeholder="Student ID"
                value={form.studentId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                max="2010-12-31"
                className="w-full p-2 border rounded"
                required
              />
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="tel"
                name="contactNumber"
                placeholder="Contact Number"
                value={form.contactNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="address.street"
                placeholder="Street"
                value={form.address.street}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="address.city"
                  placeholder="City"
                  value={form.address.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="address.state"
                  placeholder="State"
                  value={form.address.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="address.zipCode"
                  placeholder="ZIP Code"
                  value={form.address.zipCode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Academic Marks Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Academic Marks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(form.marks || {}).map(([subject, mark]) => (
                <div key={subject}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </label>
                  <input
                    type="number"
                    name={`marks.${subject}`}
                    min="0"
                    max="100"
                    value={mark || 0}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter marks (0-100)"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : isUpdate ? "Update Profile" : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
