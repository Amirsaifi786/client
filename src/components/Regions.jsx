import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { IMAGE_URL } from "../api/axios";

function Regions() {

  const [locations, setLocations] = useState([]);

  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await API.get("/location/locations");
      setLocations(res.data);
    } catch (error) {
      console.log("Location error:", error);
    }
  };

  return (
    <div className="region-section py-5">
      <div className="container">
        <h2 className="text-white text-center mb-5 h3">
          Discover Rooms, Flats & Perfect Living Spaces
        </h2>

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
  );
}

export default Regions;