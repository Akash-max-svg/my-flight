import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: "",
    age: "",
  });

  const [errors, setErrors] = useState({});

  // Create demo user if none exists and clear any existing auth
  useEffect(() => {
    // Clear any existing authentication on login page load
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    
    const existingUser = localStorage.getItem("signupUser");
    if (!existingUser) {
      const demoUser = {
        username: "demo",
        email: "demo@test.com",
        password: "Demo123!",
        confirmPassword: "Demo123!",
        mobile: "1234567890",
        age: "25",
        dob: "2000-01-01"
      };
      localStorage.setItem("signupUser", JSON.stringify(demoUser));
      console.log("✅ Demo user created:", demoUser);
    }
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const validate = () => {
    let newErrors = {};

    if (!data.username) newErrors.username = "Username required";

    if (!data.password) newErrors.password = "Password required";
    else if (!validatePassword(data.password))
      newErrors.password =
        "Password must contain uppercase, lowercase, number, special symbol & 8+ characters";

    if (!data.age) newErrors.age = "Age required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Fix the errors");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("signupUser"));

    if (!storedUser) {
      toast.error("No signup found. Please signup first.");
      navigate("/signup");
      return;
    }

    if (
      storedUser.username === data.username &&
      storedUser.password === data.password &&
      storedUser.age === data.age
    ) {
      toast.success("Login successful!");

      // ✅ STORE USER FOR HOME PAGE
      const loggedInUser = {
        username: storedUser.username,
        email: storedUser.email || "",
        age: storedUser.age,
        role: "Customer",
        loginTime: new Date().toLocaleString(),
      };

      // ✅ THIS KEY IS REQUIRED BY Home.jsx
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("isLoggedIn", "true");

      // ✅ Trigger auth change event for App.jsx
      window.dispatchEvent(new Event('authChange'));

      // ✅ Navigate AFTER saving with a small delay to ensure localStorage is set
      setTimeout(() => {
        navigate("/home");
      }, 100);
    } else {
      toast.error("Invalid credentials!");
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
          background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop&q=80');
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
          
          {/* Demo Credentials Info */}
          <div className="alert alert-info" style={{ 
            fontSize: '12px', 
            padding: '8px', 
            marginBottom: '15px',
            backgroundColor: 'rgba(13, 202, 240, 0.1)',
            border: '1px solid rgba(13, 202, 240, 0.2)',
            borderRadius: '8px'
          }}>
            <strong>Demo Credentials:</strong><br />
            Username: demo<br />
            Password: Demo123!<br />
            Age: 25
          </div>
          
          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              onChange={handleChange}
              value={data.username}
            />
            <small>{errors.username}</small>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              value={data.password}
            />
            <small>{errors.password}</small>

            <input
              type="number"
              name="age"
              className="form-control"
              placeholder="Age"
              onChange={handleChange}
              value={data.age}
            />
            <small>{errors.age}</small>

            <button type="submit" className="btn btn-primary">
              Login →
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
