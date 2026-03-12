// import React from 'react'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../components/Roomlist.css";
const Roompartnerlist = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 4;
    return (
        <>
            <div className="bg-secondary py-3 border-top border-bottom">
                <div className="container px-4">
                    <h1 className="display-4 text-white mb-2">Tenants and Room Seekers in Jaipur</h1>

                    <ul className="d-flex flex-wrap gap-2 list-unstyled">
                        <li>
                            <Link
                                to="/houses-for-rent"
                                className="btn btn-outline-light px-3 py-2 fs-6 bg-white text-orange transition"
                            >
                                Room partner
                            </Link>
                        </li>

                        <li>
                            <Link to="/three-rooms-set" className="btn bg-orange text-white px-3 py-2 fs-6">
                                Room Seekers
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>

            <div className="container px-4 py-5">
                <div className="d-flex flex-column flex-lg-row gap-4">
                    {/* Left Column - Listings */}
                    <div className="col-lg-8">
                        {/* Sort by */}
                        <div className="d-flex justify-content-end mb-4">
                            <div className="d-flex align-items-center gap-2">
                                <label className="text-muted">Sort by:</label>
                                <div className="position-relative">
                                    <select className="form-select">
                                        <option value="default">Default Order</option>
                                        <option value="price-asc">Price Low to High</option>
                                        <option value="price-desc">Price High to Low</option>
                                        <option value="date-desc" selected>Newest Properties</option>
                                        <option value="date-asc">Oldest Properties</option>
                                        <option value="featured">Featured</option>
                                        <option value="rand">Random</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Listings Container */}
                        <div className="d-flex flex-column gap-4">
                            {/* Listing Item 1 */}
                            <div className="card d-flex flex-column flex-md-row overflow-hidden">

                                <div className="col-md-12 p-4">
                                    <div className="mb-3">
                                        <h4 className="h4 fw-semibold text-dark text-orange listtitleH4 w-100">
                                            <Link to="/property/2bhk-house-in-mansarovar" className='listtitle1'>2bhk house in Mansarovar on Ajmer Road</Link>
                                        </h4>
                                    </div>
                                    <ul className="d-flex flex-wrap gap-4 mb-4 list-unstyled" style={{ fontSize: '15px' }}>
                                        <li className="d-flex align-items-center">
                                            <span className="fw-bold text-dark me-1">Looking For:</span>
                                            <span className="text-secondary">Flat / Apartment (1 BHK)</span>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <span className="fw-bold text-dark me-1">I'm doing:</span>
                                            <span className="text-secondary">Job</span>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <span className="fw-bold text-dark me-1">Max. Budget:</span>
                                            <span className="text-secondary">Rs.15,000/Month</span>
                                        </li>
                                    </ul>
                                    <div className=" flex-wrap gap-3 align-items-center">
                                   
                                        <span className="fs-6 text-muted"><i className="fa-regular fa-calendar me-1"></i>3 days ago</span>
                                        <Link to="/property/2bhk-house-in-mansarovar" className="btn butnbnumber1 btn-outline-orange px-3 py-2 fs-6 fw-semibold  ">
                                            View Detail
                                        </Link>
                                        

                                    </div>
                                </div>
                            </div>

                            {/* Listing Item 2 */}
                            <div className="card d-flex flex-column flex-md-row overflow-hidden">

                                <div className="col-md-12 p-4">
                                    <div className="mb-3">
                                        <h4 className="h4 fw-semibold text-dark hover-text-orange listtitleH4 w-100">
                                            <Link to="/property/3-room-set-house-in-sitabari" className='listtitle1'>3 room set house in Sitabari on New Sanganer Road</Link>
                                        </h4>
                                    </div>
                                    <ul className="d-flex flex-wrap gap-4 mb-4 list-unstyled" style={{ fontSize: '15px' }}>
                                        <li className="d-flex align-items-center">
                                            <span className="fw-bold text-dark me-1">Looking For:</span>
                                            <span className="text-secondary">Flat / Apartment (1 BHK)</span>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <span className="fw-bold text-dark me-1">I'm doing:</span>
                                            <span className="text-secondary">Job</span>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <span className="fw-bold text-dark me-1">Max. Budget:</span>
                                            <span className="text-secondary">Rs.15,000/Month</span>
                                        </li>
                                    </ul>
                                    <div className=" flex-wrap gap-3 align-items-center">
                                        <span className="fs-6 text-muted"><i className="fa-regular fa-calendar me-1"></i>3 days ago</span>
                                        <Link to="/property/3-room-set-house-in-sitabari" className="btn  float-right btn-outline-orange px-3 py-2 fs-6 fw-semibold butnbnumber1">
                                            View Detail
                                        </Link>

                                    </div>
                                </div>
                            </div>

                            {/* Listing Item 3 - with multiple images indicator */}
                            <div className="card d-flex flex-column flex-md-row overflow-hidden">

                                <div className="col-md-12 p-4">
                                    <div className="mb-3">
                                        <h4 className="h4 fw-semibold text-dark hover-text-orange listtitleH4 w-100">
                                            <Link to="/property/3-room-set-house-in-vatika-road" className='listtitle1'>3 room set house in Vatika road, Sanganer on Tonk Road</Link>
                                        </h4>
                                    </div>
                                    <ul className="d-flex flex-wrap gap-4 mb-4 list-unstyled" style={{ fontSize: '15px' }}>
                                        <li className="d-flex align-items-center">
                                            <span className="fw-bold text-dark me-1">Looking For:</span>
                                            <span className="text-secondary">Flat / Apartment (1 BHK)</span>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <span className="fw-bold text-dark me-1">I'm doing:</span>
                                            <span className="text-secondary">Job</span>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <span className="fw-bold text-dark me-1">Max. Budget:</span>
                                            <span className="text-secondary">Rs.15,000/Month</span>
                                        </li>
                                    </ul>
                                    <div className=" flex-wrap gap-3 align-items-center">
                                        <span className="fs-6 text-muted"><i className="fa-regular fa-calendar me-1"></i>3 days ago</span>
                                        <Link to="/property/3-room-set-house-in-vatika-road" className="btn btn-outline-orange px-3 py-2 fs-6 fw-semibold butnbnumber1">
                                            View Detail
                                        </Link>

                                    </div>
                                </div>
                            </div>
                            <nav className="mt-5 d-flex justify-content-start">
                                <ul className="pagination-custom d-flex list-unstyled align-items-center gap-2">
                                    {[...Array(totalPages)].map((_, index) => (
                                        <li key={index + 1}>
                                            <button
                                                className={`page-item-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                                onClick={() => setCurrentPage(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li>
                                        <button
                                            className="page-item-btn arrow"
                                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                        >
                                            »
                                        </button>
                                    </li>
                                    <li className="ms-2">
                                        <button
                                            className="page-next-text-btn"
                                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>

                        </div>


                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="col-lg-4">
                        <div className="d-flex flex-column gap-4">
                            {/* Search Widget */}
                            <div className="card p-4 shadow-sm">
                                <h3 className="h4 fw-semibold text-dark mb-4">Find New Home</h3>
                                <form>
                                    {/* Location Select */}


                                    {/* Additional Features */}
                                    <div className="mb-4">

                                        <div className="row g-2 overflow-auto p-2 border rounded" style={{ maxHeight: '12rem' }}>
                                            <div className="col-md-12">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg bg-light border-0"
                                                    placeholder="Search room"
                                                />
                                            </div>



                                        </div>
                                    </div>

                                    <button type="submit" className="btn bg-orange text-white py-3 fw-semibold hover-bg-orange w-100">
                                        Search
                                    </button>
                                </form>
                            </div>

                            {/* Ad Widget 1 */}
                            <div className="card overflow-hidden shadow-sm">
                                <Link to="/sale/luxury-villa">
                                    <img
                                        src="https://roomrentjaipur.com/wp-content/uploads/2022/07/Luxury-House-For-Sale.png"
                                        alt="Luxury House For Sale"
                                        className="w-100"
                                    />
                                </Link>
                            </div>

                            {/* Ad Widget 2 */}
                            <div className="card overflow-hidden shadow-sm">
                                <Link to="/property-for-sale">
                                    <img
                                        src="https://roomrentjaipur.com/wp-content/uploads/2022/07/plots-for-sale.png"
                                        alt="Plots For Sale"
                                        className="w-100"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Roompartnerlist
