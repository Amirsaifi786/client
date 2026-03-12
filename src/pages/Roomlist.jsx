import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import API, { IMAGE_URL } from "../api/axios";
import FindHome from "./FindHome";
import placeholder from "../assets/images/property-placeholder.png";

const Roomlist = () => {

  const { slug } = useParams();

  /* ================= STATES ================= */

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    location: "",
    type: "",
    rooms: "",
    baths: ""
  });

  const [formFilters, setFormFilters] = useState(filters);

  /* ================= FETCH API ================= */

  useEffect(() => {

    const fetchProperties = async () => {

      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (slug) params.append("location", slug);
        if (filters.location) params.append("location", filters.location);
        if (filters.type) params.append("type", filters.type);
        if (filters.rooms) params.append("rooms", filters.rooms);
        if (filters.baths) params.append("baths", filters.baths);

        params.append("page", page);
        params.append("limit", 6);

        const res = await API.get(
          `/property/all-properties?${params.toString()}`
        );

        setProperties(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);

      } catch (err) {
        console.log(err);
      }

      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    fetchProperties();

  }, [slug, filters, page]); // ✅ page added

  /* ================= HANDLERS ================= */

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFilters(prev => ({ ...prev, [name]: value }));
  };

  // SEARCH CLICK
  const applyFilters = () => {
    setPage(1); // ✅ reset pagination
    setFilters(formFilters);
  };

  // RESET
  const resetFilters = () => {

    const empty = {
      location: "",
      type: "",
      rooms: "",
      baths: ""
    };

    setFormFilters(empty);
    setFilters(empty);
    setPage(1);
  };

  if (loading)
    return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="container py-5">
      <div className="row g-4">

        {/* ================= LEFT LIST ================= */}
        <div className="col-lg-8">

          {properties.length === 0 ? (

            <div className="text-center py-5">
              <h4 className="fw-semibold text-muted">
                No Properties Found 😔
              </h4>

              <p className="text-muted">
                Try changing filters or reset search.
              </p>

              <button
                onClick={resetFilters}
                className="btn btn-outline-orange mt-3"
              >
                Reset Filters
              </button>
            </div>

          ) : (
            <>
              {properties.map((item) => {

                let image = placeholder;

                if (item.images?.length) {
                  image = `${IMAGE_URL}/${item.images[0]}`;
                }

                return (
                  <div key={item.id} className="card mb-4 shadow-sm">
                    <div className="row g-0">

                      <div className="col-md-5">
                        <img
                          src={image}
                          className="w-100"
                          style={{ height: 220, objectFit: "cover" }}
                          alt=""
                        />
                      </div>

                      <div className="col-md-7 p-4">
                        <h5>
                          <Link to={`/property/${item.slug}`}>
                            {item.title}
                          </Link>
                        </h5>

                        <p>{item.locality}</p>

                        <p>
                          Rooms: {item.rooms} | Baths: {item.bathrooms}
                        </p>

                        <h6>
                          ₹{item.price ||
                            item.singlePrice ||
                            item.doublePrice}
                        </h6>
                      </div>

                    </div>
                  </div>
                );
              })}

              {/* ================= PAGINATION ================= */}

              {totalPages > 1 && (
                <div className="d-flex justify-content-center gap-2 flex-wrap mt-4">

                  {/* PREV */}
                  <button
                    disabled={page === 1}
                    className="btn btn-outline-secondary"
                    onClick={() => setPage(p => p - 1)}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`btn ${
                        page === i + 1
                          ? "bg-orange text-white"
                          : "btn-outline-secondary"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  {/* NEXT */}
                  <button
                    disabled={page === totalPages}
                    className="btn btn-outline-secondary"
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </button>

                </div>
              )}

            </>
          )}

        </div>

        {/* ================= RIGHT FILTER ================= */}

        <FindHome
          filters={formFilters}
          onFilterChange={handleFormChange}
          onSearch={applyFilters}
          onReset={resetFilters}
        />

      </div>
    </div>
  );
};

export default Roomlist;