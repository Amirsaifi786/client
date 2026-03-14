import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import API, { IMAGE_URL } from "../api/axios";
import FindHome from "./FindHome";
import placeholder from "../assets/images/property-placeholder.png";

const Roomlist = () => {

  const { slug, locationSlug } = useParams();
  const parseSlug = (slug) => {
    if (!slug) return {};

    // ALL TYPES
    if (slug === "all-houses") return { type: "house" };
    if (slug === "all-flats") return { type: "flat" };
    if (slug === "all-pg") return { type: "pg" };

    // HOUSE ROOMS
    if (slug.includes("room")) {
      return {
        type: "house",
        rooms: slug.split("-")[0]
      };
    }

    // FLAT BHK
    if (slug.includes("bhk")) {
      return {
        type: "flat",
        rooms: slug.split("-")[0]
      };
    }

    // PG TYPES
    return {
      type: "pg",
      pgType: slug.replace(/-/g, " ")
    };
  };
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
        if (locationSlug) {
          params.append("location", locationSlug);
        }

        const slugFilters = slug ? parseSlug(slug) : {};
        if (slugFilters.type)
          params.append("type", slugFilters.type);

        if (slugFilters.rooms)
          params.append("rooms", Number(slugFilters.rooms));

        if (slugFilters.pgType)
          params.append("pgType", slugFilters.pgType);

        if (filters.location) params.append("location", filters.location);

        if (filters.type) params.append("type", filters.type);

        if (filters.rooms) params.append("rooms", Number(filters.rooms));

        if (filters.baths) params.append("baths", Number(filters.baths));

        params.append("page", page);
        params.append("limit", 6);

        const res = await API.get(`/property/all-properties?${params.toString()}`);
        setProperties(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    fetchProperties();
  }, [slug, filters, page]);
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
                No Properties Found
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

                  <div key={item.id} className="card property-card mb-4 shadow-sm">

                    <div className="row g-0">

                      {/* IMAGE SECTION */}
                      <div className="col-md-5 position-relative property-img">

                        <img
                          src={image}
                          className="w-100 h-100"
                          style={{ height: 230, objectFit: "cover" }}
                          alt={item.title}
                        />

                        {/* PRICE WITH GRADIENT */}
                        <div className="price-overlay ">

                          ₹{item.price || item.singlePrice || item.doublePrice} / Monthly

                        </div>

                      </div>

                      {/* DETAILS */}
                      <div className="col-md-7 p-4 d-flex flex-column justify-content-between">

                        <div>

                          <h5 className="property-title">
                            <Link to={`/propertydetail/${item.slug}`}>
                              {item.title}
                            </Link>
                          </h5>

                          <p className="text-muted mb-2">
                            <i className="fa fa-map-marker me-1"></i>
                            {item.locality}
                          </p>
                          <p className="text-muted mb-2 text-orange">
                            <i className="fa fa-clock me-1 "></i>
                            {new Date(item.created_at).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                          {/* PROPERTY FEATURES */}
                          <div className="property-features p-2">

                            <span>
                              <i className="fa fa-bed"></i> {item.rooms} Rooms
                            </span>

                            <span>
                              <i className="fa fa-bath"></i> {item.bathrooms} Baths
                            </span>

                            <span>
                              <i className="fa fa-car"></i> Parking
                            </span>

                          </div>

                        </div>

                        {/* BOTTOM ACTIONS */}
                        <div className="d-flex justify-content-between align-items-center mt-3">

                          {/* PHONE */}
                          <a href={`tel:${item.phone}`} className="phone-btn">

                            <i className="fa fa-phone"></i> {item.phone || "Call Now"}

                          </a>

                          {/* DETAIL BUTTON */}
                          <Link
                            to={`/propertydetail/${item.slug}`}
                            className="phone-btn"
                          >
                            View Details
                          </Link>

                        </div>

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
                      className={`btn ${page === i + 1
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