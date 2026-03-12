import React, { useEffect, useState } from "react";
import MyAccountSidebar from "./MyAccountSidebar";
import API from "../api/axios";

function MyBookmark() {

  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // GET BOOKMARKS
  const fetchBookmarks = async () => {
    try {
      const res = await API.get("/bookmark/bookmarked-properties");
      setBookmarks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // REMOVE BOOKMARK
  const removeBookmark = async (id) => {
    try {
      await API.patch(`/bookmark/remove-bookmark/${id}`);

      // UI instantly update
      setBookmarks(prev => prev.filter(item => item.id !== id));

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>

      {/* PAGE TITLE */}
      <div style={{ background: "#6c6c6c", padding: "45px 0", color: "#fff" }}>
        <div className="container">
          <h2 className="fw-bold">Bookmark Listings</h2>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">

          <MyAccountSidebar />

          <div className="col-md-9">

            {bookmarks.length === 0 ? (

              <div className="alert alert-info shadow-sm">
                <p className="mb-0">
                  <strong>No bookmarks!</strong> You haven't saved anything yet.
                </p>
              </div>

            ) : (

              <div className="card shadow-sm border-0">
                <div className="card-body p-0">

                  <table className="table mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Property</th>
                        <th width="120">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {bookmarks.map((item) => (
                        <tr key={item.id}>

                          <td>
                            <h6 className="mb-1 fw-semibold">
                              <a
                                href={`/property/${item.id}`}
                                className="text-dark text-decoration-none"
                              >
                                {item.title}
                              </a>
                            </h6>

                            <small className="text-muted d-block">
                              {item.address}
                            </small>

                            <span className="badge bg-success mt-2">
                              Rs.{item.price}
                            </span>
                          </td>

                          <td>
                            <button
                              onClick={() => removeBookmark(item.id)}
                              className="btn btn-outline-danger btn-sm"
                            >
                              <i className="fa fa-trash"></i> Remove
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>

                </div>
              </div>

            )}

          </div>
        </div>
      </div>

    </div>
  );
}

export default MyBookmark;