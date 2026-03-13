import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API, { IMAGE_URL } from "../api/axios";
import "./Roomdetail.css";

const PropertyDetail = () => {
    const { slug } = useParams();

    const [property, setProperty] = useState(null);
    const [images, setImages] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [message, setMessage] = useState(
        "I am interested in this property and I would like to know more details."
    );

    const sendMessage = async () => {
        try {
            await API.post("/message/send-message", {
                property_id: property.id,
                message: message
            });
            alert("Message sent to owner successfully ✅");
        } catch (error) {
            console.log(error);
            alert("Failed to send message");
        }
    };

    const toggleBookmark = async () => {
        try {
            await API.post(`/bookmark/update-bookmark/${property.id}`);
            setProperty(prev => ({
                ...prev,
                bookmark: prev.bookmark === 1 ? 0 : 1
            }));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await API.get(`/property/slug/${slug}`);
                setProperty(res.data);

                // Handle image parsing safely
                let rawImages = res.data.images;
                let parsedImages = [];

                if (typeof rawImages === "string") {
                    try {
                        parsedImages = JSON.parse(rawImages);
                    } catch (e) {
                        // If it's a single string (not a JSON array), wrap it
                        parsedImages = [rawImages];
                    }
                } else if (Array.isArray(rawImages)) {
                    parsedImages = rawImages;
                }

                setImages(parsedImages);
            } catch (error) {
                console.error("Error fetching property:", error);
            }
        };

        fetchProperty();
    }, [slug]);

    const nextImage = () => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    if (!property) return <h3 className="text-center mt-5">Loading...</h3>;

    return (
        <div className="container py-5">
            {/* IMAGE GALLERY */}
            <div className="row mb-4">
                {/* BIG IMAGE */}
                <div className="col-md-9">
                    <div className="position-relative">
                        <img
                            // Added fallback and ensured proper URL slash
                            src={images.length > 0
                                ? `${IMAGE_URL}/${images[activeIndex]}`
                                : "https://via.placeholder.com/800x500?text=No+Image+Available"}
                            className="img-fluid rounded shadow"
                            style={{ width: "100%", height: "500px", objectFit: "cover" }}
                            alt={property.title}
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="btn btn-dark position-absolute top-50 start-0 translate-middle-y ms-2"
                                >
                                    ❮
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="btn btn-dark position-absolute top-50 end-0 translate-middle-y me-2"
                                >
                                    ❯
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* VERTICAL THUMBNAILS */}
                <div className="col-md-3">
                    <div
                        className="d-flex flex-column gap-2"
                        style={{ maxHeight: "500px", overflowY: "auto" }}
                    >
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={`${IMAGE_URL}/${img}`} // Corrected with /
                                alt={`Thumbnail ${index}`}
                                onClick={() => setActiveIndex(index)}
                                style={{
                                    width: "100%",
                                    height: "120px",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                    border: activeIndex === index ? "3px solid orange" : "1px solid #ddd",
                                    borderRadius: "5px"
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-8">
                    <h2 className="fw-bold">{property.title}</h2>
                    <p className="text-muted">
                        <i className="fa fa-map-marker-alt me-1"></i>
                        {property.address}
                    </p>

                    <div className="d-flex gap-4 mt-3">
                        <div>
                            <i className="fa fa-bed text-warning"></i>
                            <span className="ms-2">{property.rooms} Rooms</span>
                        </div>
                        <div>
                            <i className="fa fa-bath text-warning"></i>
                            <span className="ms-2">{property.bathrooms} Bath</span>
                        </div>
                        <div>
                            <i className="fa fa-car text-warning"></i>
                            <span className="ms-2">{property.parking || "N/A"}</span>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 text-end">
                    <h3 className="text-primary">₹{property.price || property.singlePrice || property.doublePrice || property.triplePrice}</h3>
                    <p>Monthly Rent</p>
                    <div className="mt-2">
                        <i
                            className={`fa fa-star fa-2x ${property.bookmark === 1 ? 'text-warning' : 'text-dark'}`}
                            onClick={toggleBookmark}
                            style={{ cursor: 'pointer' }}
                            title={property.bookmark === 1 ? "Remove Bookmark" : "Add Bookmark"}
                        ></i>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* LEFT CONTENT */}
                <div className="col-lg-8">
                    <div className="card mb-4 shadow-sm">
                        <div className="card-body">
                            <h4 className="mb-4">Property Details</h4>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <strong>Offer Type</strong>
                                    <p>{property.offerType}</p>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <strong>Property Type</strong>
                                    <p>{property.propertyType}</p>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <strong>Locality</strong>
                                    <p>{property.locality}</p>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <strong>Nearby Road</strong>
                                    <p>{property.nearbyRoad}</p>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <strong>Meals</strong>
                                    <p>{property.meals || "Not Included"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {property.propertyType === "PG" && (
                        <div className="card mb-4 shadow-sm">
                            <div className="card-body">
                                <h4 className="mb-3">Pricing for PG</h4>
                                <ul className="list-group">
                                    {/* Hum check kar rahe hain ki price exist kare aur 0 na ho */}
{property.singlePrice > 0 && (
  <li className="list-group-item">
    Single Sharing : ₹{property.singlePrice}
  </li>
)}

{property.doublePrice > 0 && (
  <li className="list-group-item">
    Double Sharing : ₹{property.doublePrice}
  </li>
)}

{property.triplePrice > 0 && (
  <li className="list-group-item">
    Triple Sharing : ₹{property.triplePrice}
  </li>
)}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4>Description</h4>
                            <p dangerouslySetInnerHTML={{ __html: property.description }}></p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE CONTACT */}
                <div className="col-lg-4">
                    <div className="contact-card shadow-sm p-3 border rounded">
                        <div className="contact-header fw-bold border-bottom pb-2 mb-3">
                            Contact Details
                        </div>
                        <div className="contact-body text-center">
                            <div className="owner-avatar mb-2">
                                <i className="fa fa-user-circle fa-2x text-secondary"></i>
                            </div>
                            <h6 className="mt-2 mb-3">{property.owner_name}</h6>
                            <a href={`tel:${property.phone}`} className="btn btn-success w-100 mb-3">
                                <i className="fa fa-phone me-2"></i> {property.phone}
                            </a>
                            <p className="fw-semibold mb-2">Send message to owner</p>
                            <textarea
                                className="form-control mb-3"
                                rows="4"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button className="btn btn-primary w-100" onClick={sendMessage}>
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;