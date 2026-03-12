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

            await API.post("/property/send-message", {
                property_id: property.id,
                message: message
            });

            alert("Message sent to owner successfully ✅");

        } catch (error) {
            console.log(error);
            alert("Failed to send message");
        }

    };
    console.log(images);
    const toggleBookmark = async () => {

        try {

            await API.post(`/property/update-bookmark/${property.id}`);
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

                let parsedImages = [];

                if (res.data.images) {

                    if (Array.isArray(res.data.images)) {
                        parsedImages = res.data.images;
                    }
                    else if (typeof res.data.images === "string") {

                        try {
                            parsedImages = JSON.parse(res.data.images);
                        } catch {
                            parsedImages = res.data.images.split(",");
                        }

                    }

                }

                setImages(parsedImages);

            } catch (error) {
                console.error(error);
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
                            src={`${IMAGE_URL}${images[activeIndex]}`}
                            className="img-fluid rounded shadow"
                            style={{ width: "100%", height: "500px", objectFit: "cover" }}
                            alt=""
                        />

                        {images.length > 1 && (

                            <>

                                <button
                                    onClick={prevImage}
                                    className="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
                                >
                                    ❮
                                </button>

                                <button
                                    onClick={nextImage}
                                    className="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
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
                                src={`${IMAGE_URL}${img}`}
                                alt=""
                                onClick={() => setActiveIndex(index)}
                                style={{
                                    width: "100%",
                                    height: "120px",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                    border:
                                        activeIndex === index
                                            ? "3px solid orange"
                                            : "1px solid #ddd",
                                    borderRadius: "5px"
                                }}
                            />

                        ))}

                    </div>

                </div>

            </div>


            {/* PROPERTY HEADER */}

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
                            <span className="ms-2">{property.parking}</span>
                        </div>


                    </div>
                    <div className="float-end">
                        <i
                            className={`fa fa-star fa-2x ${property.bookmark === 1 ? 'text-warning' : 'text-dark'}`}
                            onClick={toggleBookmark}
                            style={{ cursor: 'pointer' }}
                            title={property.bookmark === 1 ? "Remove Bookmark" : "Add Bookmark"}
                        ></i>

                    </div>

                </div>


                <div className="col-md-4 text-end">

                    <h3 className="text-primary">₹{property.price || property.singlePrice || property.doublePrice || property.triplePrice}</h3>

                    <p>Monthly Rent</p>

                </div>

            </div>



            <div className="row">

                {/* LEFT CONTENT */}

                <div className="col-lg-8">


                    {/* PROPERTY DETAILS */}

                    <div className="card mb-4 shadow-sm">

                        <div className="card-body">

                            <h4 className="mb-4">Property Details</h4>

                            <div className="row">

                                <div className="col-md-4 mb-3">
                                    <strong>Property Type</strong>
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
                                    <p>{property.meals}</p>
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* PRICE DETAILS */}

                    {property.propertyType === "PG" && (

                        <div className="card mb-4 shadow-sm">

                            <div className="card-body">

                                <h4 className="mb-3">Pricing FOR PG</h4>

                                <ul className="list-group">

                                    {property.singlePrice ? (
                                        <li className="list-group-item">
                                            Single Sharing : ₹{property.singlePrice}
                                        </li>
                                    ) : null}

                                    {property.doublePrice ? (
                                        <li className="list-group-item">
                                            Double Sharing : ₹{property.doublePrice}
                                        </li>
                                    ) : null}

                                    {property.triplePrice ? (
                                        <li className="list-group-item">
                                            Triple Sharing : ₹{property.triplePrice}
                                        </li>
                                    ) : null}

                                </ul>
                            </div>

                        </div>

                    )}


                    {/* DESCRIPTION */}

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h4>Description</h4>

                            <p dangerouslySetInnerHTML={{ __html: property.description }}></p>

                        </div>

                    </div>


                </div>


                {/* RIGHT SIDE CONTACT */}
                <div className="col-lg-4">

                    <div className="contact-card shadow-sm">

                        {/* Header */}
                        <div className="contact-header">
                            Contact Details
                        </div>

                        <div className="contact-body text-center">

                            {/* Avatar */}
                            <div className="owner-avatar">
                                <i className="fa fa-user"></i>
                            </div>

                            {/* Owner Name */}
                            <h6 className="mt-2 mb-3">{property.owner_name}</h6>

                            {/* Call Button */}
                            <a
                                href={`tel:${property.phone}`}
                                className="btn btn-call w-100 mb-3"
                            >
                                <i className="fa fa-phone me-2"></i>
                                {property.phone}
                            </a>

                            {/* Message Box */}
                            <p className="fw-semibold mb-2">
                                Send message to owner
                            </p>

                            <textarea
                                className="form-control mb-3"
                                rows="4"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />

                            <button
                                className="btn btn-send w-100"
                                onClick={sendMessage}
                            >
                                Send
                            </button>

                        </div>

                    </div>

                </div>


            </div>


        </div>

    );

};

export default PropertyDetail;