import React, { useEffect, useState } from "react";
import API, { IMAGE_URL } from "../api/axios";
import MyAccountSidebar from "./MyAccountSidebar";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

function MyAccount() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  /* ================= GET USER ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) navigate("/myprofile");
    else setUser(JSON.parse(storedUser));
  }, [navigate]);

  /* ================= DROPZONE ================= */
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => {
      const file = files[0];
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    },
  });

  const removeImage = () => {
    setPhoto(null);
    setPreview(null);
  };

  /* ================= UPDATE PROFILE ================= */
  const handleSave = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Login again");

    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(user).forEach((key) => {
        if (key !== "photo") formData.append(key, user[key]);
      });

      if (photo) formData.append("photo", photo);

      const res = await API.put("/auth/update-profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }

    setLoading(false);
  };

  if (!user) return null;

  return (
    <div>
      {/* HEADER */}
      <div style={{ background: "#6c6c6c", padding: "40px 0", color: "white" }}>
        <div className="container">
          <h2>
            My Profile <br />
            Howdy, {user.firstName} {user.lastName}!
          </h2>
        </div>
      </div>

      <div className="container py-5">
  <div className="row">
    <MyAccountSidebar />

    <div className="col-md-8">
      <form onSubmit={handleSave} className="card p-4">
        <h4 className="mb-4">My Account</h4>

        <div className="row g-3">
          <div className="col-md-8">
            <input
              className="form-control"
              value={user.firstName}
              onChange={(e) =>
                setUser({ ...user, firstName: e.target.value })
              }
              placeholder="First Name"
            />
            <input
              className="form-control mt-2"
              value={user.lastName}
              onChange={(e) =>
                setUser({ ...user, lastName: e.target.value })
              }
              placeholder="Last Name"
            />
            <input className="form-control mt-2" readOnly value={user.email} />
            <input
              className="form-control mt-2"
              value={user.phone || ""}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              placeholder="Phone"
            />
            <select
              className="form-select mt-2"
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option value="Owner">Owner</option>
              <option value="Broker">Broker</option>
            </select>
          </div>

          <div className="col-md-4 d-flex flex-column align-items-center">
            <div
              {...getRootProps()}
              className="border border-secondary rounded p-2 text-center w-100"
              style={{ cursor: "pointer" }}
            >
              <input {...getInputProps()} />
              {preview || user.photo ? (
                <img
                  src={preview || `${IMAGE_URL}${user.photo}`}
                  alt="Profile"
                  className="img-fluid rounded"
                  style={{ maxHeight: "150px", objectFit: "cover" }}
                />
              ) : (
                <p className="mb-0">Upload Photo</p>
              )}
            </div>
            {preview && (
              <button
                type="button"
                className="btn btn-danger btn-sm mt-2"
                onClick={removeImage}
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <button className="btn btn-primary mt-3" disabled={loading}>
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  </div>
</div>
    </div>
  );
}

export default MyAccount;