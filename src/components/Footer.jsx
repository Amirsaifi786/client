import React from 'react';
import "./Footer.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
function Footer() {
  return (
    <>
      <footer id="footer" className="footer-main text-white pt-5 pb-3 bg-light py-5 text-secondary">
        <div className="container px-4">
          <div className="row g-4">

            {/* Logo and About Section */}
            <div className="col-md-6">
              <img
                src={logo}
                alt="Room Rent Jaipur"
                className="logo-img h-12 w-20 mb-4"
              />
              <p className="text-muted" style={{maxWidth: '30rem'}}>
                roomrentjaipur.com is the oldest real estate portal of Jaipur. Our
                aim is to give home-seekers and home-owners a simple yet innovative
                interface where both parties can contact each other free of cost.
                Our listings are 100% verified and showing genuine pictures of
                properties.
              </p>
            </div>

            {/* Helpful Links */}
            {/* Helpful Links Section */}
            <div className="col-md-3">
              <h4 className="h5 fw-bold mb-4 text-dark border-bottom pb-2" style={{ borderBottomColor: 'rgb(254, 134, 40) !important' }}>
                Helpful Links
              </h4>
              <ul className="list-unstyled">
                {[
                  { name: "My Account", path: "/account" },
                  { name: "Post your property", path: "/submit-property" },
                  { name: "Room Partners", path: "/room-partners" },
                  { name: "Room Seekers", path: "/room-seekers" },
                  { name: "Contact", path: "/contact" },
                  { name: "Privacy Policy", path: "/privacy-policy" }
                ].map((link) => (
                  <li key={link.name} className="mb-2">
                    <Link
                      to={link.path}
                      className="footer-link text-decoration-none text-white"
                    >
                      <i className="fa-solid fa-angle-right me-2 small" style={{ color: 'rgb(254, 134, 40)' }} />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us Section */}
            <div className="col-md-3">
              <h4 className="h5 fw-bold mb-4 text-dark border-bottom pb-2" style={{ borderBottomColor: '#f1592a !important' }}>
                Contact Us
              </h4>
              <div className="text-secondary small">
                <p className="d-flex align-items-start mb-3">
                  <i className="fa-solid fa-location-dot me-3 mt-1" style={{ color: '#f1592a' }} />
                  <span className='text-white'>Plot no. 40, Katewa Nagar, Gujar ki thadi, New Sanganer Road, Jaipur - 302020</span>
                </p>
                <p className="d-flex align-items-center mb-3">
                  <i className="fa-solid fa-envelope me-3" style={{ color: '#f1592a' }} />
                  <a href="mailto:roomrentjaipur@gmail.com" className="text-decoration-none text-white">
                    roomrentjaipur@gmail.com
                  </a>
                </p>
              </div>

              {/* Social Icons - Circle Style */}
             <div className="d-flex gap-2 mt-4">
              {[
                { icon: 'fa-facebook-f' },
                { icon: 'fa-twitter' },
                { icon: 'fa-linkedin-in' },
                { icon: 'fa-instagram' }
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="social-icon-circle d-flex align-items-center justify-content-center text-decoration-none"
                  style={{ width: '50px', height: '50px', border: '1px solid #ddd', color: '#555' }}
                >
                  <i className={`fa-brands ${social.icon}`} />
                </a>
              ))}
            </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-5 pt-4 border-top text-center fs-6 text-muted">
            Copyright © 2011-2021 Room Rent Jaipur. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* BACK TO TOP */}
      <div id="backtotop" className="position-fixed bottom-0 end-0 p-3">
        <a
          href="#"
          className="bg-orange text-white d-flex align-items-center justify-content-center rounded-circle shadow transition"
          style={{width: '3rem', height: '3rem'}}
        >
          <i className="fa-solid fa-arrow-up" />
        </a>
      </div>
    </>
  );
}

export default Footer;