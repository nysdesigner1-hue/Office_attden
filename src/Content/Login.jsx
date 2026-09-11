import { useState } from "react";
import "./StaffLogin.css";
import Notification from "./Notification";
import Home from "./Home";
import axios from 'axios'
const StaffLogin = () => {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMessage, setMessage] = useState(false)
  const [message, setmsg] = useState(null)
  const [type, setType] = useState(null)
  const [showHome, setShowHome] = useState(false)
  const [usrData, setUserData] = useState(null)
  const handleLogin = (e) => {
    e.preventDefault();

    if (!staffId || !password) {
      setMessage(true);
      return;
    }

    const loginData = {staffId, password}
    axios.post(`/api/data`, loginData)
      .then(response => {
        if (response.data.message === "user exist") {
          setShowHome(true);
          console.log(response.data.userId);
          const userDataGot = response.data.userId;
          setUserData(userDataGot);
        } else {
          console.log(response.data);
          setmsg(response.data.message);
          setType("error");
          setMessage(true);
        }
      })
      .catch(error => {
        console.error("Login Error:", error);
        setmsg("Server error, please try again.");
        setType("error");
        setMessage(true);
      });

    console.log("Staff ID:", staffId);
  };
console.log("This is user data " + usrData)
  return (
    <>
    {showHome ? <Home name={usrData}/> : (<div className="staff-login-page">
        {showMessage ? <Notification message={message} duration={3000} type={type} onClose={() => setMessage(false) } /> : null}
      <div className="staff-login-card">

        <div className="staff-login-header">
          <div className="staff-login-icon">
            <span>✓</span>
          </div>

          <h1>Staff Login</h1>
          <p>Sign in to access your staff portal</p>
        </div>

        <form onSubmit={handleLogin} className="staff-login-form">

          <div className="staff-input-group">
            <label htmlFor="staffId">Staff ID</label>

            <div className="staff-input-wrapper">
              <span className="staff-input-icon">ID</span>

              <input
                id="staffId"
                type="text"
                placeholder="Enter your Staff ID"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="staff-input-group">
            <label htmlFor="password">Password</label>

            <div className="staff-input-wrapper">
              <span className="staff-input-icon">••</span>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="staff-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="staff-login-options">
            <label className="staff-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="staff-forgot-password"
              onClick={() => alert("Please contact your administrator.")}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="staff-login-button">
            Login to Staff Portal
          </button>

        </form>

        <div className="staff-login-footer">
          <p>Authorized staff members only</p>
        </div>

      </div>
    </div>)}
    </>
  );
};

export default StaffLogin;