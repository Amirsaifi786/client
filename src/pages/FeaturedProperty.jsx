import React from "react";
import { IMAGE_URL } from "../api/axios";
import { Link } from "react-router-dom";
import "./FeaturedProperty.css";

export default function FeaturedProperty({ properties }) {
  return (
    <div className="container py-5 featured-section">

      <div className="testimonial-heading text-center">
        <h2>Feature Property</h2>
      </div>

      <div className="row g-4">
        {Array.isArray(properties) && properties.length > 0 ? (
          properties.map((item) => (
            <div className="col-lg-4 col-md-6" key={item.id}>
              <Link to={`/propertydetail/${item.slug}`} className="property-card">
                <div className="listing-img-container">
                  <img
                    src={`${IMAGE_URL}/${item.images ? JSON.parse(item.images)[0] : "no-image.jpg"}`}
                    alt={item.title}
                  />
                  <div className="listing-badges">
                    <span className="badge badge-featured">Featured</span>
                    <span className="badge badge-rent">Rent</span>
                  </div>
                  <div className="listing-info">
                    <h6>{item.title}</h6>
                    <span className="price">₹{item.price}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No properties available</p>
        )}
      </div>

    </div>
  );
}