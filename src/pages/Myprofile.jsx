import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Myprofile.css";
import ForgotPassword from "../components/ForgotPassword";

const Myprofile = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("register");
  const [emailOTP, setEmailOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // ================= SECURITY VALIDATION =================

  const sanitize = (value) => {
    return value.replace(/[<>]/g, "");
  };

  const validateRegister = () => {
    const { firstName, email, password, phone, role } = registerData;

    if (!firstName || !email || !password || !phone || !role) {
      toast.error("All fields required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be 6+ chars");
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Invalid phone number");
      return false;
    }

    return true;
  };

  // ================= INPUT =================

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setOtpSent(false);
      setEmailVerified(false);
      setEmailOTP("");
    }

    setRegisterData((prev) => ({
      ...prev,
      [name]: sanitize(value),
    }));
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: sanitize(e.target.value),
    });
  };

  // ================= OTP =================

  const sendOTP = async () => {
    if (!registerData.email) {
      toast.error("Enter email first");
      return;
    }

    try {
      await API.post("/auth/send-otp", {
        email: registerData.email,
      });

      setOtpSent(true);
      toast.success("OTP sent to email");
    } catch {
      toast.error("OTP sending failed");
    }
  };

  const verifyOTP = async () => {
    try {
      await API.post("/auth/verify-otp", {
        email: registerData.email,
        otp: emailOTP,
      });

      setEmailVerified(true);
      toast.success("Email verified");
    } catch {
      toast.error("Invalid OTP");
    }
  };

  // ================= REGISTER =================

  const handleRegister = async () => {
    if (!validateRegister()) return;

    try {
      const res = await API.post("/auth/register", registerData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.dispatchEvent(new Event("authChanged"));

      toast.success("Registration Successful");

      setTimeout(() => {
        navigate("/my-profile");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  // ================= LOGIN =================

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", loginData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.dispatchEvent(new Event("authChanged"));

      toast.success(`Welcome ${res.data.user.firstName}`);

      setTimeout(() => {
        navigate("/my-profile");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  // ================= SUBMIT =================

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (!emailVerified) {
      toast.error("Verify email first");
      return;
    }

    handleRegister();
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  // ================= UI =================

  return (
    <section className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="w-100" style={{ maxWidth: "450px" }}>
        <div className="bg-white shadow rounded-4 p-4 profile-card">

          {/* Tabs */}
          <div className="d-flex border-bottom mb-4">
            <button
              onClick={() => setActiveTab("login")}
              className={`tab-btn ${activeTab === "login" ? "active-tab" : ""}`}
            >
              LOG IN
            </button>

            <button
              onClick={() => setActiveTab("register")}
              className={`tab-btn ${activeTab === "register" ? "active-tab" : ""}`}
            >
              REGISTER
            </button>
            
          </div>

          {/* REGISTER */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="d-flex flex-column gap-3">

              {/* <h4 className="fw-bold">Register</h4> */}

              <input name="firstName" placeholder="First Name" className="form-control" onChange={handleRegisterChange} />
              <input name="lastName" placeholder="Last Name" className="form-control" onChange={handleRegisterChange} />
              <input type="email" name="email" placeholder="Email" className="form-control" onChange={handleRegisterChange} />

              {!otpSent && (
                <button type="button" className="btn btn-secondary" onClick={sendOTP}>
                  Send Email OTP
                </button>
              )}

              {otpSent && !emailVerified && (
                <>
                  <input className="form-control" placeholder="Enter OTP"
                    onChange={(e) => setEmailOTP(e.target.value)} />

                  <button type="button" className="btn btn-success" onClick={verifyOTP}>
                    Verify OTP
                  </button>
                </>
              )}

              <input name="phone" placeholder="Phone" className="form-control" onChange={handleRegisterChange} />
              <input type="password" name="password" placeholder="Password" className="form-control" onChange={handleRegisterChange} />

              <select name="role" className="form-select" onChange={handleRegisterChange}>
                <option value="">Select Role</option>
                <option value="Owner">Owner</option>
                <option value="Broker">Broker</option>
              </select>

              <button type="submit" className="btn-orange w-100" disabled={!emailVerified}>
                Continue →
              </button>
            </form>
          )}

          {/* LOGIN */}
          {activeTab === "login" && (
            <>
              <form onSubmit={handleLoginSubmit} className="d-flex flex-column gap-3">
                <input type="email" name="email" placeholder="Email" className="form-control" onChange={handleLoginChange} />
                <input type="password" name="password" placeholder="Password" className="form-control" onChange={handleLoginChange} />

                <button type="submit" className="btn-orange w-100">Login</button>
              </form>

              <div className="text-center mt-2">
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab("forgot")}
                >
                  Forgot Password?
                </span>
              </div>
            </>
          )}

          {/* FORGOT PASSWORD */}
          {activeTab === "forgot" && (
            <ForgotPassword onClose={() => setActiveTab("login")} />
          )}

        </div>
      </div>
    </section>
  );
};

export default Myprofile;