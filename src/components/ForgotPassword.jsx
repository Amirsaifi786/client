import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

 const sendOTP = async () => {
  if (!email) return toast.error("Enter your email");
  try {
    await API.post("/auth/send-otp", { email });
    setOtpSent(true);
    toast.success("OTP sent to email");
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to send OTP");
  }
};

 const resetPassword = async () => {
  if (!otp || !newPassword) return toast.error("Enter OTP and new password");
  try {
    // Only call reset-password, it will check OTP internally
    await API.put("/auth/reset-password", { email, otp, newPassword });
    toast.success("Password reset successfully");
    onClose();
  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid OTP or reset failed");
  }
};

  return (
    <div className="card p-4 mt-3">
      <h5>Forgot Password</h5>
      <input
        type="email"
        placeholder="Enter your email"
        className="form-control mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {!otpSent ? (
        <button className="btn btn-secondary w-100" onClick={sendOTP}>Send OTP</button>
      ) : (
        <>
          <input
            placeholder="Enter OTP"
            className="form-control mb-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="form-control mb-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="btn btn-success w-100" onClick={resetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
}