import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import API from "../api/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import "./SubmitProperty.css";
import API, { IMAGE_URL } from "../api/axios";

function SubmitProperty() {
    const { id } = useParams();
    const propertyId = id;
    // alert(propertyId);

    const isEditMode = !!propertyId;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [user, setUser] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/myprofile");
        } else {
            setUser(JSON.parse(storedUser));
        }

        if (propertyId) {
            fetchProperty(propertyId);
        }
    }, [propertyId]);

    // const removeExistingImage = (index) => {
    //     setExistingImages(existingImages.filter((_, i) => i !== index));
    // };
    const removeExistingImage = (index) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };
    const fetchProperty = async (propertyId) => {
        try {
            const res = await API.get(`/property/${propertyId}`);
            const data = res.data;

            setFormData({
                offerType: data.offerType || "",
                propertyType: data.propertyType || "",
                price: data.price || "",
                rooms: data.rooms || "",
                bathrooms: data.bathrooms || "",
                parking: data.parking || "",
                address: data.address || "",
                locality: data.locality || "",
                title: data.title || "",
                nearbyRoad: data.nearbyRoad || "",
                singlePrice: data.singlePrice || "",
                doublePrice: data.doublePrice || "",
                triplePrice: data.triplePrice || "",
                meals: data.meals || ""
            });

            setDescription(data.description || "");
            setSelectedFeatures(data.features || []);

            // ✅ VERY IMPORTANT
            setExistingImages(
                typeof data.images === "string"
                    ? JSON.parse(data.images)
                    : data.images || []
            );
            setVideoUrl(data.video || null);

        } catch (err) {
            console.error(err);
        }
    };

    // ================= FORM STATE =================
    const [formData, setFormData] = useState({
        offerType: "",
        propertyType: "",
        price: "",
        rooms: "",
        bathrooms: "",
        parking: "",
        address: "",
        locality: "",
        title: "",

        // PG fields
        pgType: "",
        roomType: "",
        singlePrice: "",
        doublePrice: "",
        triplePrice: "",
        meals: ""
    });

    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // ================= FEATURES =================
    const features = [
        "Air Conditioning", "Balcony", "Internet", "Swimming Pool",
        "Almirah", "Bed", "Fan", "Fridge", "Table", "TV", "Wardrobe"
    ];

    // ================= INPUT CHANGE =================
    // const handleChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         [e.target.name]: e.target.value
    //     });
    // };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {

            let updated = { ...prev, [name]: value };

            if (name === "singlePrice" && value) {
                updated.doublePrice = "";
                updated.triplePrice = "";
            }

            if (name === "doublePrice" && value) {
                updated.singlePrice = "";
                updated.triplePrice = "";
            }

            if (name === "triplePrice" && value) {
                updated.singlePrice = "";
                updated.doublePrice = "";
            }

            return updated;
        });
    };

    // ================= FEATURES =================
    const handleFeatureChange = (feature) => {
        if (selectedFeatures.includes(feature)) {
            setSelectedFeatures(
                selectedFeatures.filter(f => f !== feature)
            );
        } else {
            setSelectedFeatures([...selectedFeatures, feature]);
        }
    };

    // ================= IMAGE UPLOAD =================
    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        onDrop: (acceptedFiles) => {
            setImages([...images, ...acceptedFiles]);
        }
    });

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        if (video) {
            data.append("video", video);
        }
        // EXISTING VIDEO
        data.append("existingVideo", videoUrl || "");

        data.append("description", description);
        data.append("features", JSON.stringify(selectedFeatures));
        data.append("user_id", user?.id || "");

        // ✅ NEW IMAGES
        images.forEach(img => {
            data.append("images", img);
        });

        // ✅ OLD IMAGES (remaining)
        data.append("existingImages", JSON.stringify(existingImages));

        try {

            setLoading(true);

            if (isEditMode) {
                await API.put(`/property/${propertyId}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                await API.post("/property", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            // ✅ Success message
            if (isEditMode) {
                toast.success("Property updated successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.success("Property submitted successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
            setErrorMessage("");

            setLoading(false);

            setTimeout(() => {
                navigate("/my-properties");
            }, 1000);

            // RESET
            setFormData({
                offerType: "",
                propertyType: "",
                price: "",
                rooms: "",
                bathrooms: "",
                parking: "",
                address: "",
                locality: "",
                title: "",
                singlePrice: "",
                doublePrice: "",
                triplePrice: "",
                meals: ""
            });

            setDescription("");
            if (!isEditMode) {
                setImages([]);
            }
            setSelectedFeatures([]);

        } catch (err) {

            // ❌ Error message
            toast.error("Something went wrong!", {
            position: "top-right",
            autoClose: 3000,
            });
            setSuccessMessage("");
            setLoading(false);

        }
    };

    return (
        <>
            {/* ===== HEADER ===== */}
            <div className="bg-dark text-white text-center py-5 mb-4">
                <h2 className="fw-bold mb-2">
                    {isEditMode ? "Update Property" : "Submit Your Property"}
                </h2>
                <p className="mb-0 opacity-75">
                    Fill details to list your property faster
                </p>
            </div>

            <div className="container" style={{ maxWidth: "1100px" }}>

                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <form onSubmit={handleSubmit}>
                    {/* ================= BASIC INFO ================= */}
                    <div className="card shadow-sm mb-4 form-section">
                        <div className="card-header bg-light">
                            <h5>Basic Information</h5>
                        </div>

                        <div className="card-body row">

                            <div className="col-md-4 mb-3">
                                <label>I want to</label>
                                <select name="offerType" className="form-select"
                                    value={formData.offerType}
                                    onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option>Sale</option>
                                    <option>Rent</option>
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label>Property Type</label>
                                <select name="propertyType"
                                    className="form-select"
                                    value={formData.propertyType}
                                    onChange={handleChange}
                                    required>
                                    <option value="">Select</option>
                                    <option value="House">House</option>
                                    <option value="Flat">Flat</option>
                                    <option value="PG">PG / Hostel</option>
                                    {/* <option value="Commercial">Commercial</option>
                  <option value="Plot">Plot</option> */}
                                </select>
                            </div>
                            {formData.propertyType !== "PG" && (
                                <div className="col-md-4 mb-3">
                                    <label>Price</label>
                                    <input type="number" name="price"
                                        className="form-control"
                                        value={formData.price}
                                        onChange={handleChange} />
                                </div>
                            )}
                            <div className="col-md-6 mb-3">
                                <label>Address</label>
                                <input name="address" className="form-control"
                                    value={formData.address}
                                    onChange={handleChange} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Locality</label>
                                <input name="locality" className="form-control"
                                    value={formData.locality}
                                    onChange={handleChange} />
                            </div>

                            {/* Rooms */}
                            <div className="col-md-3 mb-3">
                                <label>Rooms</label>
                                <select
                                    name="rooms"
                                    className="form-select"
                                    value={formData.rooms}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                </select>
                            </div>

                            {/* Bathrooms */}
                            <div className="col-md-3 mb-3">
                                <label>Bathrooms</label>
                                <select
                                    name="bathrooms"
                                    className="form-select"
                                    value={formData.bathrooms}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3+</option>
                                </select>
                            </div>

                            {/* Parking */}
                            <div className="col-md-3 mb-3">
                                <label>Parking</label>
                                <select
                                    name="parking"
                                    className="form-select"
                                    value={formData.parking}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option>Bike Parking</option>
                                    <option>Car Parking</option>
                                    <option>No Parking</option>
                                </select>
                            </div>

                            {/* Nearby Road */}
                            <div className="col-md-3 mb-3">
                                <label>Nearby Road</label>
                                <input
                                    type="text"
                                    name="nearbyRoad"
                                    className="form-control"
                                    placeholder="e.g. Main Road, Highway"
                                    value={formData.nearbyRoad || ""}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>
                    </div>

                    {/* ================= PG DETAILS ================= */}
                    {formData.propertyType === "PG" && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-header">
                                <h5>PG / Hostel Details</h5>
                            </div>

                            <div className="card-body">
                                <div className="row g-3">

                                    <div className="col-md-4">
                                        <label className="form-label">PG Type</label>
                                        <select
                                            name="pgType"
                                            className="form-select"
                                            value={formData.pgType}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select</option>
                                            <option value="Boys">Boys PG</option>
                                            <option value="Girls">Girls PG</option>
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Room Type</label>
                                        <select
                                            name="roomType"
                                            className="form-select"
                                            value={formData.roomType}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select</option>
                                            <option value="Single">Single</option>
                                            <option value="Double">Double</option>
                                            <option value="Triple">Triple</option>
                                        </select>
                                    </div>

                                    {formData.roomType === "Single" && (
                                        <div className="col-md-4">
                                            <label className="form-label">Single Price</label>
                                            <input
                                                type="number"
                                                name="singlePrice"
                                                className="form-control"
                                                value={formData.singlePrice}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    )}

                                    {formData.roomType === "Double" && (
                                        <div className="col-md-4">
                                            <label className="form-label">Double Price</label>
                                            <input
                                                type="number"
                                                name="doublePrice"
                                                className="form-control"
                                                value={formData.doublePrice}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    )}

                                    {formData.roomType === "Triple" && (
                                        <div className="col-md-4">
                                            <label className="form-label">Triple Price</label>
                                            <input
                                                type="number"
                                                name="triplePrice"
                                                className="form-control"
                                                value={formData.triplePrice}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Property Title */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Property Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            className="form-control form-control-lg"
                            placeholder="Example: Fully Furnished PG for Boys in Jaipur"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* ================= DESCRIPTION ================= */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-light">
                            <h5>Description</h5>
                        </div>

                        <div className="card-body">
                            <CKEditor
                                editor={ClassicEditor}
                                data={description}
                                onChange={(e, editor) =>
                                    setDescription(editor.getData())
                                }
                            />
                        </div>
                    </div>

                    {/* ================= IMAGE UPLOAD ================= */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-light">
                            <h5>Gallery Upload</h5>
                        </div>

                        <div className="card-body">

                            <div {...getRootProps()} className="dropzone-box text-center">
                                <input {...getInputProps()} />
                                <h6 className="mb-1">Drag & Drop Images</h6>
                                <small className="text-muted">or click to browse</small>
                            </div>

                            <div className="row mt-3">

                                {/* OLD IMAGES */}
                                {existingImages.map((img, index) => (
                                    <div className="col-md-2 col-4 mb-3 position-relative" key={"old" + index}>

                                        <img
                                            src={`${IMAGE_URL}/${img}`}
                                            className="img-fluid rounded"
                                            alt=""
                                        />

                                        {/* ❌ REMOVE BUTTON */}
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            style={{
                                                position: "absolute",
                                                top: "5px",
                                                right: "5px",
                                                background: "red",
                                                border: "none",
                                                color: "white",
                                                borderRadius: "50%",
                                                width: "25px",
                                                height: "25px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            ×
                                        </button>

                                    </div>
                                ))}

                                {/* NEW IMAGES */}
                                {images.map((file, index) => (
                                    <div className="col-md-2 col-4 mb-3" key={"new" + index}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            className="img-fluid rounded preview-img"
                                            alt=""
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm w-100 mt-1"
                                            onClick={() => removeImage(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}

                            </div>

                        </div>
                    </div>

                    {/* ================= FEATURES ================= */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Other Features</h5>
                        </div>

                        <div className="card-body">
                            <div className="row">

                                {features.map((feature, index) => (
                                    <div className="col-md-3 col-6 mb-2" key={index}>
                                        <label className="feature-box">

                                            <input
                                                type="checkbox"
                                                checked={selectedFeatures.includes(feature)}
                                                onChange={() => handleFeatureChange(feature)}
                                            />

                                            <span className="p-2">{feature}</span>

                                        </label>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>

                    {/* ================= VIDEO UPLOAD ================= */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-light">
                            <h5>Property Video</h5>
                        </div>

                        <div className="card-body">

                            <input
                                type="file"
                                accept="video/*"
                                className="form-control"
                                onChange={handleVideoChange}
                            />

                            {/* EXISTING VIDEO */}
                            {videoUrl && !video && (
                                <div className="mt-3">
                                    <video width="100%" height="300" controls>
                                        <source src={`${IMAGE_URL}/${videoUrl}`} />
                                    </video>

                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm mt-2"
                                        onClick={() => setVideoUrl(null)}
                                    >
                                        Remove Video
                                    </button>
                                </div>
                            )}

                            {/* NEW VIDEO */}
                            {video && (
                                <div className="mt-3">
                                    <video width="100%" height="300" controls>
                                        <source src={URL.createObjectURL(video)} />
                                    </video>

                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm mt-2"
                                        onClick={() => setVideo(null)}
                                    >
                                        Remove Video
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* ================= SUBMIT BUTTON ================= */}
                    <button
                        className="btn btn-primary w-100 py-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Uploading Property...
                            </>
                        ) : (
                            isEditMode ? "Update Property" : "Submit Property"
                        )}
                    </button>

                </form>
            </div>
        </>
    );
}

export default SubmitProperty;