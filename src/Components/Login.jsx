import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Clear any existing authentication on login page load
  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!data.email) {
      newErrors.email = "Email required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!data.password) {
      newErrors.password = "Password required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors");
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API
      const response = await apiService.login({
        email: data.email,
        password: data.password,
      });

      if (response.status === 'success') {
        toast.success("Login successful!");

        // Store user data and token
        const loggedInUser = {
          ...response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          loginTime: new Date().toLocaleString(),
        };

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("isLoggedIn", "true");

        // Trigger auth change event for App.jsx
        window.dispatchEvent(new Event('authChange'));

        // Navigate to home
        setTimeout(() => {
          navigate("/home");
        }, 100);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
        }

        .login-bg {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1920&h=1080&fit=crop&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .login-card {
          width: 420px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 35px;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .login-title {
          color: #3b2a8f;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .form-control {
          border-radius: 12px;
          padding: 12px;
          text-align: center;
          margin-bottom: 5px;
          border: 1px solid #ddd;
          width: 100%;
        }

        .form-control:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 2px rgba(139,92,246,0.2);
          outline: none;
        }

        small {
          color: #dc2626;
          font-size: 12px;
          display: block;
          margin-bottom: 10px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6d28d9, #4f46e5);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          padding: 10px;
          width: 100%;
        }

        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 20px 0;
        }
      `}</style>

      <div className="login-bg">
        <div className="login-card">
          <h3 className="login-title">Login to FlightBook</h3>
          
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email Address"
              onChange={handleChange}
              value={data.email}
              disabled={isLoading}
            />
            <small>{errors.email}</small>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              value={data.password}
              disabled={isLoading}
            />
            <small>{errors.password}</small>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login →'
              )}
            </button>
          </form>

          <div className="divider"></div>

          <p className="text-center">
            Don't have an account?
            <span
              style={{
                color: "#6d28d9",
                cursor: "pointer",
                marginLeft: "5px",
                fontWeight: "600",
              }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
