import React, { useEffect, useState } from "react";
import API, { IMAGE_URL } from "../api/axios";
import MyAccountSidebar from "./MyAccountSidebar";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

function MyAccount() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  /* ================= GET USER ================= */

useEffect(() => {
  const storedUser = localStorage.getItem("user");
console.log("testuser",storedUser);
  if (!storedUser) {
    navigate("/myprofile");
  } else {
    setUser(JSON.parse(storedUser));
  }
}, [navigate]);



  /* ================= DROPZONE ================= */

  const { getRootProps, getInputProps } = useDropzone({

    accept: { "image/*": [] },
    maxFiles: 1,

    onDrop: (acceptedFiles) => {

      const file = acceptedFiles[0];

      setPhoto(file);
      setPreview(URL.createObjectURL(file));

    }

  });
  const removeImage = () => {

    setPhoto(null);
    setPreview(null);

  };



  /* ================= SUBMIT ================= */

  const handleSave = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      formData.append("role", user.role);

      if (photo) {
        formData.append("photo", photo);
      }

     const res = await API.put(
      "/user/update-profile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);

    setSuccessMessage("✅ Update User Successfully !");
            setErrorMessage("");
             setTimeout(() => {
                setSuccessMessage("");
            }, 3000);


    } catch (err) {

      setLoading(false);

      if (err.response) {

        alert(err.response.data.message);

        console.log("Server Error:", err.response.data);

      } else if (err.request) {

        alert("Server not responding. Check backend server.");

      } else {

        alert("Something went wrong");

      }

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

          {/* SIDEBAR */}

          <MyAccountSidebar />



          <div className="col-md-8">

            <form onSubmit={handleSave}>

              <div className="row">



                {/* LEFT FORM */}

                <div className="col-md-8">
                  {successMessage && (
                    <div className="alert alert-success">
                      {successMessage}
                    </div>
                  )}

                  {errorMessage && (
                    <div className="alert alert-danger">
                      {errorMessage}
                    </div>
                  )}


                  <h4 className="mb-4">My Account</h4>



                  <label>First Name</label>

                  <input
                    type="text"
                    className="form-control mb-3"
                    value={user.firstName}
                    onChange={(e) =>
                      setUser({ ...user, firstName: e.target.value })
                    }
                  />



                  <label>Last Name</label>

                  <input
                    type="text"
                    className="form-control mb-3"
                    value={user.lastName}
                    onChange={(e) =>
                      setUser({ ...user, lastName: e.target.value })
                    }
                  />



                  <label>Email</label>

                  <input
                    type="email"
                    className="form-control mb-3 readonly"
                    readOnly
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />

                  <label>Phone Number</label>

                  <input
                    type="text"
                    className="form-control mb-3"
                    value={user.phone || ""}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                  />



                  <label>I'm a</label>

                  <select
                    className="form-select mb-3"
                    value={user.role}
                    onChange={(e) =>
                      setUser({ ...user, role: e.target.value })
                    }
                  >

                    <option value="">Select Role</option>
                    <option value="Owner">Property Owner / Landlord</option>
                    <option value="Broker">Broker</option>

                  </select>

                </div>



                {/* RIGHT IMAGE */}

                <div className="col-md-4">

                  <h4 className="mb-4">Your Photo</h4>



                  {/* UPLOAD BOX */}

                  <div
                    {...getRootProps()}
                    className="border p-4 text-center bg-light rounded"
                    style={{ cursor: "pointer" }}
                  >

                    <input {...getInputProps()} />

                    <p className="mb-0">
                      Drag & Drop Photo <br /> or Click
                    </p>

                  </div>



                  {/* OLD IMAGE */}

                  {!preview && user.photo && (

                    <div className="mt-3">

                      <img
                       src={`${IMAGE_URL}${user.photo}`}
                        className="img-fluid rounded"
                        alt="profile"
                      />

                    </div>

                  )}



                  {/* PREVIEW IMAGE */}

                  {preview && (

                    <div className="mt-3 position-relative">

                      <img
                        src={preview}
                        className="img-fluid rounded"
                        alt="preview"
                      />

                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0"
                        onClick={removeImage}
                      >

                        ✕

                      </button>

                    </div>

                  )}

                </div>



              </div>



              <button
                className="btn btn-danger mt-4"
                disabled={loading}
              >

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