import React from 'react'
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function MyAccountSidebar() {
  const navigate = useNavigate();
  return (

    <div className="col-md-3">

      <div className="border p-3 bg-light">

        <h6 className="mb-3">Manage Your Ad</h6>

        <ul className="list-unstyled">

          {/* <li className="mb-2 text-orange">
            <Link to="/my-responses">View Response</Link>
          </li> */}
          <li className="mb-2">
            <Link to="/my-properties">My Properties</Link>
          </li>

          <li className="mb-2">
            <Link to="/submit-property">Submit New Property</Link>
          </li>

          <li className="mb-3">
            <Link to="/my-bookmarks">Bookmarked Listings</Link>
          </li>

        </ul>

        <hr />

        <h6 className="mb-3">Manage Account</h6>

        <ul className="list-unstyled">

          <li className="mb-2"><Link to="/my-profile">My Profile</Link></li>

          <li
            className="mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");

              window.dispatchEvent(new Event("authChanged"));

              navigate("/myprofile");
            }}
          >
            Log Out
          </li>

        </ul>

      </div>

    </div>




  )
}
