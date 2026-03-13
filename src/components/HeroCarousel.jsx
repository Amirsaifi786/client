import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; 

import slider1 from "../assets/images/slider1.png";
import slider2 from "../assets/images/slider2.png";
import slider3 from "../assets/images/slider3.png";

function HeroCarousel() {

  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
const [selectedType, setSelectedType] = useState("");
  const slides = [
    { id: 1, bgImage: slider2 },
    { id: 2, bgImage: slider1 },
    { id: 3, bgImage: slider3 }
  ];

  // LOCATION API
  const fetchLocations = async () => {
    try {
      const res = await API.get("/location/locations");
      setLocations(res.data);
    } catch (error) {
      console.log("Location error:", error);
    }
  };

  // AUTO SLIDER + FETCH API
  useEffect(() => {

    fetchLocations(); // 👉 API call

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  // SLUG FUNCTION
  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  // SEARCH CLICK
const handleSearch = (e) => {

  e.preventDefault();

  const params = new URLSearchParams();

  if (selectedLocation) {
    const slug = selectedLocation.toLowerCase().replace(/\s+/g, "-");
    params.append("location", slug);
  }

  if (selectedType) {
    params.append("type", selectedType);
  }

  navigate(`/location/${params.toString()}`);

};

  return (
    <div  className="parallax"
      style={{
        backgroundImage: `url(${slides[activeIndex].bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "500px",
        position: "relative"
      }}>

      <div className="container text-center text-white"
        style={{ paddingTop: "120px" }}
      >

        <h2 className="display-4 fw-bold mb-4">
          Find Your Dream Home
        </h2>

      
      <form onSubmit={handleSearch}>
  <div className="row g-2 with-forms justify-content-center">

    {/* PROPERTY TYPE */}
    <div className="col-md-3">
      <select
        className="form-select custom-input"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >

        <option value="">Any type</option>
        <option value="Houses">Houses</option>
        <option value="Flats">Flats</option>
        <option value="Boys PG">Boys PG</option>
        <option value="Girls PG">Girls PG</option>

      </select>
    </div>

    {/* LOCATION */}
    <div className="col-md-7">
      <select
        className="form-select custom-input"
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
      >

        <option value="">Anywhere in Jaipur</option>

        {locations.map((loc) => (
          <option key={loc.id} value={loc.title}>
            {loc.title}
          </option>
        ))}

      </select>
    </div>

    {/* SEARCH */}
    <div className="col-md-auto">
      <button className="btn custom-input btn-primary">
        <i className="fa-solid fa-magnifying-glass" />
      </button>
    </div>

  </div>
</form>

                  <div className="adv-search-btn mt-3">
                    Need more search options?{' '}
                    <a href="#" className="text-white text-decoration-underline">
                      Advanced Search
                    </a>
                  </div>

      </div>
    </div>
  );
}

export default HeroCarousel;