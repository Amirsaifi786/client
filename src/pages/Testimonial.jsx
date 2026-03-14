import React from "react";
import "./Testimonial.css";
import user from "../assets/user.jpg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function Testimonial() {

const testimonials = [
  {
    id: 1,
    name: "Rohit Sharma",
    image: user,
    review:
      "Room Dekho helped me find a clean and affordable room near my office in just 2 days. The process was smooth and hassle-free.",
  },
  {
    id: 2,
    name: "Pooja Verma",
    image: user,
    review:
      "I posted my PG listing on Room Dekho and received multiple enquiries within a day. Highly recommended for property owners.",
  },
  {
    id: 3,
    name: "Aman Khan",
    image: user,
    review:
      "Great platform for students and working professionals. I easily found a good PG in Vidhyadhar Nagar at a reasonable price.",
  },
  {
    id: 4,
    name: "Nasir Ali",
    image: user,
    review:
      "Very helpful service! I shifted to Jaipur recently and this website made it easy to find a rental room quickly.",
  },
  {
    id: 5,
    name: "Neha Gupta",
    image: user,
    review:
      "The website is simple to use and the property details are clear. I found a safe girls PG within my budget.",
  },
  {
    id: 6,
    name: "Rahul Meena",
    image: user,
    review:
      "Room Dekho is one of the best platforms to search for rooms and flats in Jaipur. I found a 1RK very quickly.",
  }
];
  return (
    <section className="testimonial-section">

      <div className="container">

        {/* Heading */}
        <div className="testimonial-heading text-center">
          <h2>Hear From Our Happy Customers</h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={40}
          slidesPerView={3}
          autoplay={{
            delay: 3000,
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

              <div className="testimonial-card " style={{ marginTop: "30px" }}>

                {/* Avatar */}
                <div className="testimonial-avatar">
                  <img src={item.image} alt={item.name} />
                </div>

                {/* Review */}
                <p className="testimonial-review">
                  {item.review}
                </p>

                {/* Name */}
                <h6 className="testimonial-name">— {item.name}</h6>

                {/* Stars */}
                <div className="testimonial-stars">
                  ★ ★ ★ ★ ★
                </div>

              </div>

            </SwiperSlide>
          ))}
        </Swiper>

      </div>

    </section>
  );
}