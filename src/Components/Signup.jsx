import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    age: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const validate = () => {
    let err = {};

    if (!user.username) err.username = "Username required";

    if (!user.email) err.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(user.email))
      err.email = "Enter a valid email";

    if (!user.password) err.password = "Password required";
    else if (!validatePassword(user.password))
      err.password =
        "Password must contain uppercase, lowercase, special symbol & 8+ characters";

    if (!user.confirmPassword)
      err.confirmPassword = "Confirm password required";
    else if (user.password !== user.confirmPassword)
      err.confirmPassword = "Passwords do not match";

    if (!user.mobile) err.mobile = "Mobile number required";
    if (!user.age) err.age = "Age required";
    if (!user.dob) err.dob = "DOB required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Fix the errors");
      return;
    }

    // ✅ Store full data for login validation
    localStorage.setItem("signupUser", JSON.stringify(user));

    // ✅ Store minimal data for Home page
    const loggedInUser = {
      username: user.username,
      email: user.email,
      age: user.age,
      mobile: user.mobile,
      role: "Customer",
      signupTime: new Date().toLocaleString(),
    };

    // ✅ Home.jsx reads THIS
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("isLoggedIn", "true");

    // ✅ Trigger auth change event for App.jsx
    window.dispatchEvent(new Event('authChange'));

    toast.success("Signup successful!");

    // ✅ Navigate AFTER storing data with a small delay
    setTimeout(() => {
      navigate("/home");
    }, 100);
  };

  return (
    <>
      <style>{`
        .signup-bg {
          min-height: 100vh;
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .signup-card {
          width: 420px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 35px;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .signup-title {
          color: #1e40af;
          font-weight: 700;
          margin-bottom: 10px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .form-control {
          border-radius: 12px;
          padding: 12px;
          width: 100%;
          margin-bottom: 5px;
        }

        .form-control:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79,70,229,0.2);
          outline: none;
        }

        small {
          color: #dc2626;
          font-size: 12px;
          display: block;
          margin-bottom: 8px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          padding: 10px;
          width: 100%;
        }
      `}</style>

      <div className="signup-bg">
        <div className="signup-card shadow-lg">
          <h3 className="signup-title">Create Your Account</h3>
          <p className="text-muted">Join us and explore ✨</p>

          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="username" 
              className="form-control" 
              placeholder="Username" 
              onChange={handleChange} 
              value={user.username}
            />
            <small>{errors.username}</small>

            <input 
              type="email" 
              name="email" 
              className="form-control" 
              placeholder="Email Address" 
              onChange={handleChange} 
              value={user.email}
            />
            <small>{errors.email}</small>

            <input 
              type="password" 
              name="password" 
              className="form-control" 
              placeholder="Password" 
              onChange={handleChange} 
              value={user.password}
            />
            <small>{errors.password}</small>

            <input 
              type="password" 
              name="confirmPassword" 
              className="form-control" 
              placeholder="Confirm Password" 
              onChange={handleChange} 
              value={user.confirmPassword}
            />
            <small>{errors.confirmPassword}</small>

            <input 
              type="text" 
              name="mobile" 
              className="form-control" 
              placeholder="Mobile Number" 
              onChange={handleChange} 
              value={user.mobile}
            />
            <small>{errors.mobile}</small>

            <input 
              type="number" 
              name="age" 
              className="form-control" 
              placeholder="Age" 
              onChange={handleChange} 
              value={user.age}
            />
            <small>{errors.age}</small>

            <input 
              type="date" 
              name="dob" 
              className="form-control" 
              onChange={handleChange} 
              value={user.dob}
            />
            <small>{errors.dob}</small>

            <button type="submit" className="btn btn-primary">
              Sign Up →
            </button>
          </form>

          <div style={{ height: "1px", background: "#e5e7eb", margin: "20px 0" }}></div>

          <p className="text-center">
            Already have an account?
            <span
              style={{
                color: "#4f46e5",
                cursor: "pointer",
                marginLeft: "5px",
                fontWeight: "600",
              }}
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
