import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div>

      {/* MAP SECTION */}
      <section className="contact-map">

        <iframe
          title="map"
          src="https://www.google.com/maps?q=Plot%20No.%2040%20Katewa%20Nagar%20Jaipur&output=embed"
          loading="lazy"
        ></iframe>

        <div className="office-box">
          <h5>Our Office</h5>

          <p>
            <i className="fa-solid fa-location-dot"></i>
            Plot no. 40, Katewa Nagar
          </p>

          <p>
            Gujar ki thadi, New Sanganer Road
          </p>

          <p>Jaipur – 302020</p>

        </div>

      </section>


      {/* CONTACT SECTION */}
      <section className="contact-section container">

        <div className="row g-5">

          {/* LEFT INFO */}
          <div className="col-md-4">

            <h3 className="mb-4">Get in Touch</h3>

            <p>
              We are here to help you find the best rental properties in Jaipur.
              Feel free to contact us anytime.
            </p>

            <div className="contact-info">

              <div className="info-item">
                <i className="fa-solid fa-globe"></i>
                <a href="https://roomrentjaipur.com">
                  www.roomrentjaipur.com
                </a>
              </div>

              <div className="info-item">
                <i className="fa-solid fa-envelope"></i>
                <a href="mailto:contact@roomrentjaipur.com">
                  contact@roomrentjaipur.com
                </a>
              </div>

            </div>

          </div>


          {/* CONTACT FORM */}
          <div className="col-md-8">

            <div className="contact-form">

              <h3 className="mb-4">Send Message</h3>

              <form>

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email Address"
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Subject"
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Message"
                    ></textarea>
                  </div>

                  <div className="col-md-12">
                    <button className="btn btn-contact">
                      Send Message
                    </button>
                  </div>

                </div>

              </form>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Contact;