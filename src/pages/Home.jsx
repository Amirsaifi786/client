import HeroCarousel from '../components/HeroCarousel';
import { useEffect, useState } from "react";
import API, { IMAGE_URL } from "../api/axios";
import { Link } from "react-router-dom";
import Testimonial from './Testimonial';
import FeaturedProperty from './FeaturedProperty';
import Regions from "../components/Regions";
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
      const res = await API.get("/location/locations");
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
                <Link to="/property/all-houses">Houses</Link>
                <Link to="/property/all-flats">Flats</Link>
              </div>
            </div>
          </div>

          {/* <div className="col-6 col-md-3">
            <div className="property-box">
              <i className="fa-solid fa-building icon"></i>
              <h5>Office Shops</h5>
              <div className="links">
                <a href="#">View Now</a>
              </div>
            </div>
          </div> */}

          <div className="col-6 col-md-3">
            <div className="property-box">
              <i className="fa-solid fa-hotel icon"></i>
              <h5>PG / Hostel</h5>
              <div className="links">
                <Link to="/property/boys-pg">Boys</Link>
                <Link to="/property/girls-pg">Girls</Link>
              </div>
            </div>
          </div>

          {/* <div className="col-6 col-md-3">
            <div className="property-box">
              <i className="fa-solid fa-tag icon"></i>
              <h5>For Sale</h5>
              <div className="links">
                <a href="#">View Now</a>
              </div>
            </div>
          </div> */}

        </div>
      </div>

      {/* POPULAR REGIONS */}
      <Regions />

      {/* FEATURED PROPERTIES */}
      <FeaturedProperty properties={properties} />

      {/* TESTIMONIALS */}
      <Testimonial />
    </div>
  );
}

export default Home;