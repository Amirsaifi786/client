import React from "react";
import "./Testimonial.css";
import user from "../assets/user.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function Testimonial() {

  // Only positive reviews here ✅
  const testimonials = [
    {
      id: 1,
      name: "Mukesh C.",
      role: "Tenant",
      image:
        user,
      review: "Great & precise service. Thanks to the team!",
    },
    {
      id: 2,
      name: "Ritika Sharma",
      role: "Property Owner",
      image:
    user,
      review:
        "Posting my property was very easy and I received responses quickly.",
    },
    {
      id: 3,
      name: "Amit Verma",
      role: "Tenant",
      image:
        user,
      review:
        "Smooth experience! Found a room within 2 days. Highly recommended.",
    },
  ];

  return (
    <section className="testimonial-section py-5">
      <div className="container">

        {/* Heading */}
        <div className="text-center mb-5">
          <h3 className="fw-bold">What Our Clients Say</h3>
          <p className="text-muted">
            We collect reviews so you can get an honest opinion.
          </p>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={3}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="testimonial-box bg-white p-4 rounded shadow-sm">

               <p className="testimonial-text">
                “{item.review}”
                </p>

                <div className="d-flex align-items-center mt-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="testimonial-img me-3"
                  />

                  <div>
                    <h6 className="mb-0 fw-semibold">{item.name}</h6>
                    <small className="text-muted">{item.role}</small>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}