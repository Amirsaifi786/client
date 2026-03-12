import HeroCarousel from '../components/HeroCarousel';
import { useEffect, useState } from "react";
import API, { IMAGE_URL } from "../api/axios";
import { Link } from "react-router-dom";
import Testimonial from './Testimonial';
import FeaturedProperty from './FeaturedProperty';
function Home() {

  const [locations, setLocations] = useState([]);
  const [properties, setProperties] = useState([]);
  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };
  useEffect(() => {

    fetchLocations();
    fetchProperties();

  }, []);

  // Top Properties
  const fetchProperties = async () => {
    try {
      const res = await API.get("/property/top-properties");
      setProperties(res.data);
    } catch (error) {
      console.log("Property error:", error);
    }
  };

  // Locations
  const fetchLocations = async () => {
    try {
      const res = await API.get("/property/locations");
      setLocations(res.data);
    } catch (error) {
      console.log("Location error:", error);
    }
  };
  return (
    <div className="home-wrapper">
      {/* BANNER */}

      {/* WHAT ARE YOU LOOKING FOR */}
      <HeroCarousel />
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">What are you looking for?</h2>

        <div className="row text-center justify-content-center g-4">

          <div className="col-6 col-md-3">
            <div className="property-box">
              <i className="fa-solid fa-house icon"></i>
              <h5>Houses / Flats</h5>
              <div className="links">
                <a href="#">Houses</a>
                <a href="#">Flats</a>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="property-box">
              <i className="fa-solid fa-building icon"></i>
              <h5>Office Shops</h5>
              <div className="links">
                <a href="#">View Now</a>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="property-box">
              <i className="fa-solid fa-hotel icon"></i>
              <h5>PG / Hostel</h5>
              <div className="links">
                <a href="#">Boys</a>
                <a href="#">Girls</a>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="property-box">
              <i className="fa-solid fa-tag icon"></i>
              <h5>For Sale</h5>
              <div className="links">
                <a href="#">View Now</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* POPULAR REGIONS */}
      <div className="region-section py-5">
        <div className="container">
          <h2 className="text-white text-center mb-5 h3">Discover Rooms, Flats & Perfect Living Spaces</h2>

          <div className="row g-4">

            {locations.map((city) => (

              <div className="col-md-4" key={city.id}>



                <Link
                  to={`/location/${slugify(city.title)}`}
                  className="img-box d-block position-relative shadow-sm rounded-3 overflow-hidden"
                  style={{
                    backgroundImage: `url(${IMAGE_URL}/${city.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "250px"
                  }}
                >

                  <div className="img-box-overlay position-absolute top-0 start-0 w-100 h-100"></div>

                  <div
                    className="img-box-content position-absolute bottom-0 start-0 p-4 text-white w-100"
                    style={{ zIndex: 2 }}
                  >

                    <h4 className="fw-bold mb-0">{city.title}</h4>

                    <span className="small opacity-75">
                      {city.available} Properties Available
                    </span>

                  </div>

                </Link>
              </div>

            ))}

          </div>
        </div>
      </div>

      {/* FEATURED PROPERTIES */}
     <FeaturedProperty properties ={properties}/>

      {/* TESTIMONIALS */}
      <Testimonial />
    </div>
  );
}

export default Home;