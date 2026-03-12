import React from "react";
import { Link } from "react-router-dom";

export default function FindHome({ filters, onFilterChange, onSearch ,onReset }) {
  return (
    <div className="col-lg-4">
      <div className="d-flex flex-column gap-4">

        {/* Search Widget */}
        <div className="card p-4 shadow-sm">
          <h3 className="h4 fw-semibold text-dark mb-4">
            Find New Home
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch();
            }}
          >

            {/* Location */}
            <div className="mb-4">
              <select
                name="location"
                className="form-select"
                value={filters.location}
                onChange={onFilterChange}
              >
                <option value="">All over Jaipur</option>
                <option value="sodala">Sodala</option>
                <option value="malviya nagar">Malviya Nagar</option>
                <option value="vaishali nagar">Vaishali Nagar</option>
                <option value="mansarovar">Mansarovar</option>
                <option value="jhotwara">Jhotwara</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="mb-4">
              <select
                name="type"
                className="form-select"
                value={filters.type}
                onChange={onFilterChange}
              >
                <option value="">Any Property Type</option>
                <option value="house">House</option>
                <option value="flat">Flat</option>
                <option value="boys-pg">Boys PG</option>
                <option value="girls-pg">Girls PG</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* Rooms + Baths */}
            <div className="row g-3 mb-4">
              <div className="col-6">
                <select
                  name="rooms"
                  className="form-select"
                  value={filters.rooms}
                  onChange={onFilterChange}
                >
                  <option value="">Rooms</option>
                  <option value="1">1 Room</option>
                  <option value="2">2 Room</option>
                  <option value="3">3 Room</option>
                  <option value="4">4 Room</option>
                </select>
              </div>

              <div className="col-6">
                <select
                  name="baths"
                  className="form-select"
                  value={filters.baths}
                  onChange={onFilterChange}
                >
                  <option value="">Baths</option>
                  <option value="1">1 Bath</option>
                  <option value="2">2 Bath</option>
                  <option value="3">3 Bath</option>
                </select>
              </div>
            </div>

            <div className="d-flex gap-2">
                <button type="submit" className="btn bg-orange text-white w-100">
                    Search
                </button>

                <button
                    type="button"
                    onClick={onReset}
                    className="btn btn-outline-secondary w-100"
                >
                    Reset
                </button>
                </div>
            
          </form>
        </div>

        {/* Ads */}
        <div className="card overflow-hidden shadow-sm">
          <Link to="/sale/luxury-villa">
            <img
              src="https://roomrentjaipur.com/wp-content/uploads/2022/07/Luxury-House-For-Sale.png"
              className="w-100"
              alt=""
            />
          </Link>
        </div>

      </div>
    </div>
  );
}