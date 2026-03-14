import { useEffect, useState } from "react";
import API, { IMAGE_URL } from "../api/axios";

function Locations() {

    const [locations, setLocations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        available: "",
        file: null
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        const res = await API.get("location/locations");
        setLocations(res.data);
    };

    const handleChange = (e) => {

        if (e.target.name === "file") {

            setForm({ ...form, file: e.target.files[0] });

        } else {

            setForm({ ...form, [e.target.name]: e.target.value });

        }

    };

    const openAddModal = () => {
        setForm({ title: "", available: "", file: null });
        setEditId(null);
        setShowModal(true);
    };

    const openEditModal = (data) => {

        setForm({
            title: data.title,
            available: data.available,
            file: null,
            image: data.image
        });

        setEditId(data.id);
        setShowModal(true);

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("title", form.title);
        formData.append("available", form.available);

        if (form.file) {
            formData.append("image", form.file);
        }

        if (editId) {

            await API.put(`location/update-location/${editId}`, formData);

        } else {

            await API.post("location/add-location", formData);

        }

        fetchLocations();
        setShowModal(false);

    };

    const deleteLocation = async (id) => {

        if (window.confirm("Delete location?")) {

            await API.delete(`location/delete-location/${id}`);
            fetchLocations();

        }

    };

    return (

        <div className="container mt-4 "style={{ border: "4px solid orange", padding: "10px" }}>
             <div className="bg-secondary py-3 border-top border-bottom">
                <div className="container px-4 text-white">
                    <h1 className="display-4 mb-2">Location List</h1>                                     
                </div>
            </div>

            <div className="d-flex justify-content-between mb-3">

                <h4></h4>

                <button className="btn btn-success m-2" onClick={openAddModal}>
                    Add Location
                </button>

            </div>

            <table className="table table-bordered m-2">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Location</th>
                        <th>Image</th>
                        <th>Available</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {locations.map(loc => (
                        <tr key={loc.id}>

                            <td>{loc.id}</td>

                            <td>{loc.title}</td>

                            <td>
                                <img
                                    src={`${IMAGE_URL}${loc.image}`}
                                    alt=""
                                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                />
                            </td>

                            <td>{loc.available}</td>

                            <td>

                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => openEditModal(loc)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteLocation(loc.id)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>


            {/* MODAL */}

            {showModal && (

                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5>{editId ? "Edit Location" : "Add Location"}</h5>

                                <button
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>

                            </div>

                            <div className="modal-body">

                                <form onSubmit={handleSubmit}>

                                    <div className="mb-3">

                                        <label>Location</label>

                                        <input
                                            type="text"
                                            name="title"
                                            className="form-control"
                                            value={form.title}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label>Image</label>

                                        {editId && form.image && (
                                            <img
                                                src={`${IMAGE_URL}${form.image}`}
                                                style={{ width: "80px", display: "block", marginBottom: "10px" }}
                                            />
                                        )}

                                        <input
                                            type="file"
                                            name="file"
                                            className="form-control"
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label>Available Properties</label>

                                        <input
                                            type="number"
                                            name="available"
                                            className="form-control"
                                            value={form.available}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <button className="btn btn-success w-100">
                                        {editId ? "Update" : "Add"}
                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Locations;