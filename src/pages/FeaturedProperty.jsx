import React from "react";
import { IMAGE_URL } from "../api/axios";

export default function FeaturedProperty({ properties }) {
  return (
    <div className="container py-5">
      <h3 className="headline text-start mb-4">Featured</h3>

      <div className="row justify-content-center g-4">
        {properties.map((item) => (
          <div className="col-md-4" key={item.id}>
            <div className="listing-item">

              <div className="listing-img-container">

                <img
                  src={`${IMAGE_URL}/${
                    item.images
                      ? JSON.parse(item.images)[0]
                      : "no-image.jpg"
                  }`}
                  className="img-fluid"
                  alt={item.title}
                />

                <div className="listing-badges">
                  <span className="badge bg-orange me-1">Featured</span>
                  <span className="badge bg-orange">Rent</span>
                </div>

                <div className="listing-compact-title d-flex justify-content-between">
                  <span>{item.title}</span>
                  <span>₹{item.price}</span>
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
