import React from 'react'
import "./Topbar.css";
import { Link } from "react-router-dom";
export default function Topbar() {
  return (
      <div className="topbar d-none d-md-block">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">

            {/* LEFT */}
            <div className="topbar-left">

              <span>
                <i className="fa-solid fa-envelope"></i>
                roomrentjaipur@gmail.com
              </span>

              <span>
                <i className="fa-solid fa-phone"></i>
                +91 98765 43210
              </span>

            </div>

            {/* RIGHT */}
            <div className="topbar-right">
              <div className="top-social">

                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#"><i className="fa-brands fa-twitter"></i></a>
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>

              </div>

            </div>

          </div>
        </div>
      </div>
  )
}
