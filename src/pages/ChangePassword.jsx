import React, { useEffect, useState } from "react";
import MyAccountSidebar from "./MyAccountSidebar";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function ChangePassword() {
 const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!newPassword) {
      toast.error("Enter new password");
      return;
    }

    setLoading(true);

    try {
      await API.put(
        "/auth/change-password",
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password changed successfully");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    }

    setLoading(false);
  };

  return (
    <div>
      {/* PAGE TITLE */}
      <div style={{ background: "#6c6c6c", padding: "40px 0", color: "white" }}>
        <div className="container">
          <h2>Change Password</h2>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <MyAccountSidebar />

          {/* RIGHT CONTENT */}
          <div className="col-md-8">
             <form onSubmit={handleChangePassword} className="card p-4 mt-4" style={{ maxWidth: "400px" }}>
                <h5 className="mb-3">Change Password</h5>
                <input
                    type="password"
                    className="form-control mb-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                />
                <button className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Updating..." : "Change Password"}
                </button>
                </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;