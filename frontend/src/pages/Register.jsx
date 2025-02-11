import { useState } from "react";
import { registerUser } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await registerUser(form);
      
      if (response && response.token) { 
        localStorage.setItem("token", response.token); // Store token for authentication
        navigate("/dashboard"); // Redirect to Dashboard
      } else {
        setError("Registration successful, but no token received. Try logging in.");
        navigate("/"); // Fallback to Login
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="p-5 bg-white shadow-md rounded-lg w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="mb-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          Register
        </button>

        <p className="text-center text-sm mt-3">
          Already have an account? <Link to="/" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
}
