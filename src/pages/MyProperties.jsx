import React, { useEffect, useState } from "react";
import MyAccountSidebar from "./MyAccountSidebar";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function MyResponses() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchProperties(parsedUser.id, 1);
    } else {
      navigate("/myprofile");
    }
  }, []);

  const fetchProperties = async (userId, pageNumber = 1) => {
    try {
      const res = await API.post("/property/user", {
        user_id: userId,
        page: pageNumber,
        limit: 5,
      });

      const formattedProps = res.data.data.map(p => ({
        ...p,
        status: Number(p.status) || 0,
      }));

      setProperties(formattedProps);
      setTotalPages(res.data.totalPages);
      setPage(pageNumber);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const toggleStatus = async (propertyId, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await API.patch(`/property/${propertyId}/status`, {
        status: newStatus,
      });

      // Update UI immediately
      setProperties((prev) =>
        prev.map((prop) =>
          prop.id === propertyId ? { ...prop, status: newStatus } : prop
        )
      );

      // Show message
      setStatusMessage(
        newStatus === 1
          ? "Your property is now live and visible to everyone!"
          : "Your property has been hidden from public view."
      );

      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error("Error updating status:", err);
      setStatusMessage("Failed to update property status.");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  return (
    <div>
      {/* PAGE TITLE */}
      <div style={{ background: "#6c6c6c", padding: "40px 0", color: "white" }}>
        <div className="container">
          <h2>My Properties</h2>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <MyAccountSidebar />

          {/* RIGHT CONTENT */}
          <div className="col-md-8">
            {statusMessage && (
              <div className="alert alert-success text-center">{statusMessage}</div>
            )}
            {loading ? (
              <div className="alert alert-info">Loading properties...</div>
            ) : properties.length === 0 ? (
              <>
                <div className="alert alert-info">
                  <p>You haven't submitted any properties yet.</p>
                </div>
                <a href="/submit-property" className="btn btn-warning mt-3">
                  Submit New Property
                </a>
              </>
            ) : (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Status</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((prop) => (
                    <tr key={prop.id}>
                      <td>
                        <h5>
                          <a href={`/property/${prop.slug}`}>{prop.title}</a>
                          <br />
                          <small>
                            (Updated on{" "}
                            {new Date(prop.updated_at || prop.created_at).toLocaleDateString()})
                          </small>
                        </h5>
                        <span>Rs. {prop.price}</span>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${prop.status === 1 ? "btn-success" : "btn-danger"
                            }`}
                          onClick={() => toggleStatus(prop.id, prop.status)}
                        >
                          {prop.status === 1 ? "Active" : "Deactive"}
                        </button>
                      </td>
                      <td>
                        <a
                          href={`/submit-property/${prop.id}`}
                          className="btn btn-sm btn-primary me-2"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            )}
            {/* PAGINATION */}
            <div className="d-flex justify-content-center mt-4 gap-2">

              <button
                className="btn btn-outline-secondary"
                disabled={page === 1}
                onClick={() => fetchProperties(user.id, page - 1)}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`btn ${page === index + 1 ? "btn-primary" : "btn-outline-primary"
                    }`}
                  onClick={() => fetchProperties(user.id, index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="btn btn-outline-secondary"
                disabled={page === totalPages}
                onClick={() => fetchProperties(user.id, page + 1)}
              >
                Next
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyResponses;