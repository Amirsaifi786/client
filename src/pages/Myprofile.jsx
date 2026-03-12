import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Myprofile.css";

const Myprofile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("register");
 const [emailOTP, setEmailOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

const sendOTP = async () => {
  if (!registerData.email) {
    alert("Enter email first");
    return;
  }

  try {
    await API.post("/auth/send-otp", {
      email: registerData.email,
    });

    setOtpSent(true);
    alert("OTP sent to email");

  } catch {
    alert("OTP failed");
  }
};

const verifyOTP = async () => {
  try {
    await API.post("/auth/verify-otp", {
      email: registerData.email,
      otp: emailOTP,
    });

    setEmailVerified(true);
    alert("Email verified");

  } catch {
    alert("Invalid OTP");
  }
};
  // ================= STATES =================
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

  // ================= INPUT HANDLERS =================
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= API CALLS =================
  const handleRegister = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // ✅ notify whole app
    window.dispatchEvent(new Event("authChanged"));

    alert("Registration Successful ✅");
    navigate("/my-profile");

  } catch (err) {
    alert(err.response?.data?.message || "Registration failed");
  }
};

const handleLogin = async (data) => {
  try {
    const res = await API.post("/auth/login", data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // ✅ notify header
    window.dispatchEvent(new Event("authChanged"));

    alert(`Welcome ${res.data.user.firstName}`);
    navigate("/my-profile");

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  // ================= SUBMIT =================
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (!emailVerified) {
      alert("Verify email first");
      return;
    }

    handleRegister(registerData);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    handleLogin(loginData);
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

          {/* ================= REGISTER ================= */}
          {activeTab === "register" && (
            <>
              <form onSubmit={handleRegisterSubmit} className="d-flex flex-column gap-3">

                <h4 className="fw-bold">Register</h4>

                <input name="firstName" placeholder="First Name"
                  className="form-control"
                  onChange={handleRegisterChange}
                />

                <input name="lastName" placeholder="Last Name"
                  className="form-control"
                  onChange={handleRegisterChange}
                />

                <input type="email" name="email" placeholder="Email"
                  className="form-control"
                  onChange={handleRegisterChange}
                />
                {!otpSent && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={sendOTP}
                >
                  Send Email OTP
                </button>
              )}

              {otpSent && !emailVerified && (
                <>
                  <input
                    placeholder="Enter OTP"
                    className="form-control"
                    onChange={(e) => setEmailOTP(e.target.value)}
                  />

                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={verifyOTP}
                  >
                    Verify OTP
                  </button>
                </>
              )}

              {emailVerified && (
                <p className="text-success">✅ Email Verified</p>
              )}

                <input name="phone" placeholder="Phone"
                  className="form-control"
                  onChange={handleRegisterChange}
                />

                <input type="password" name="password" placeholder="Password"
                  className="form-control"
                  onChange={handleRegisterChange}
                />

                <select name="role"
                  className="form-select"
                  onChange={handleRegisterChange}
                >
                  <option value="">Select Role</option>
                  <option value="Owner">Owner</option>
                  <option value="Broker">Broker</option>
                </select>

                <button
                type="submit"
                className="btn-orange w-100"
                disabled={!emailVerified}
              >
                Continue →
              </button>
              </form>
              <div id="recaptcha-container"></div>

              <p className="text-center small mt-3">
                Already a member?{" "}
                <span className="link-orange"
                  onClick={() => setActiveTab("login")}>
                  Login Now
                </span>
              </p>
            </>
          )}

          {/* ================= LOGIN ================= */}
          {activeTab === "login" && (
            <>
              <form onSubmit={handleLoginSubmit} className="d-flex flex-column gap-3">

                <h4 className="fw-bold">Login</h4>

                <input type="email" name="email" placeholder="Email"
                  className="form-control"
                  onChange={handleLoginChange}
                />

                <input type="password" name="password" placeholder="Password"
                  className="form-control"
                  onChange={handleLoginChange}
                />

                <button type="submit" className="btn-orange w-100">
                  Login
                </button>
              </form>

              <p className="text-center small mt-3">
                Don't have an account?{" "}
                <span className="link-orange"
                  onClick={() => setActiveTab("register")}>
                  Register
                </span>
              </p>
            </>
          )}

        </div>
      </div>
    </section>
  );
};

export default Myprofile;