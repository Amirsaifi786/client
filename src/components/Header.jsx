import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Header.css";
import Topbar from "./Topbar";
import API from "../api/axios";
function Header() {
  
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

useEffect(() => {
  const checkLogin = () => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  };

  checkLogin();

  // listen login/logout
  window.addEventListener("authChanged", checkLogin);

  return () => {
    window.removeEventListener("authChanged", checkLogin);
  };
}, []);

const [menuItems, setMenuItems] = useState([]);

useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await API.get("/property/menu");
      const data = res.data;

      // Convert object to array for easier mapping
      const items = Object.keys(data).map(key => ({
        title: key,        // Houses / Flats / PG/Hostel
        dropdown: data[key]
      }));

      setMenuItems(items);
    } catch (err) {
      console.error("Menu fetch error:", err);
    }
  };

  fetchMenu();
}, []);

useEffect(() => {
  const handleClickOutside = () => {
    setOpenDropdown(null);
  };

  document.addEventListener("click", handleClickOutside);

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // Mobile click control
  // const [hoveredIndex, setHoveredIndex] = useState(null); // Desktop hover control
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const menuItems = [
  //   {
  //     title: "Houses",
  //     dropdown: [
  //       { title: "All Property", path: "/allproperty" },
  //       { title: "One Room Set", path: "/three-room-set-for-rent-in-jaipur" },
  //       { title: "Two Rooms Set", path: "/three-room-set-for-rent-in-jaipur" },
  //       { title: "Three Rooms Set", path: "/three-room-set-for-rent-in-jaipur" },
  //       { title: "Four Rooms Set", path: "/three-room-set-for-rent-in-jaipur" },
  //     ],
  //   },
  //   {
  //     title: "Flats",
  //     dropdown: [
  //       { title: "1 BHK Flats", path: "/1bhk-flats" },
  //       { title: "2 BHK Flats", path: "/2bhk-flats" },
  //       { title: "3 BHK Flats", path: "/3bhk-flats" },
  //       { title: "4 BHK Flats", path: "/4bhk-flats" },
  //     ],
  //   },
  //   {
  //     title: "PG/Hostel",
  //     dropdown: [
  //       { title: "PG | Hostel for Boys", path: "/pg-boys" },
  //       { title: "PG | Hostel for Girls", path: "/pg-girls" },
  //     ],
  //   },
  //   {
  //     title: "People’s Need",
  //     dropdown: [
  //       { title: "RoomPartner/RoomSeeker", path: "/room-seekers" },
  //     ],
  //   },

  // ];

  return (
    <div className="text-dark">
      {/* TOP BAR */}
      <Topbar />
      {/* MAIN HEADER */}
      <header className={`sticky-top w-100 transition ${scrolled ? 'bg-white shadow py-2' : 'bg-white py-2'}`}>
        <div className="container px-3 d-flex align-items-center justify-content-between">

          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Logo" className="logo-img" />
          </Link>

          {/* MOBILE HAMBURGER */}
          <button
            className="hamburger-btn d-lg-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav className="d-none d-lg-block h-100">
            <ul className="d-flex align-items-center list-unstyled m-0 p-0 main-menu">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="position-relative h-100 py-1"
                  // onMouseEnter={() => setHoveredIndex(index)}
                  // onMouseLeave={() => setHoveredIndex(null)}
                >
                  {item.dropdown ? (
                    <button
                    className="px-3 d-flex align-items-center gap-1 fs-6 fw-bold text-uppercase"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === index ? null : index);
                    }}
                  >
                      {item.title}
                      <i className="fa-solid fa-chevron-down"></i>
                    </button>
                  ) : (
                    <Link to={item.path} className="px-3 fs-6 fw-bold text-uppercase text-secondary">
                      {item.title}
                    </Link>
                  )}

                  {/* DROPDOWN - State based visibility */}
                  {item.dropdown && openDropdown === index && (
                    <div className="position-absolute start-0 top-100 pt-2 dropdown-menu-custom" style={{ minWidth: '16rem' }}>
                      <div className="bg-white shadow rounded-3 border overflow-hidden py-2 animate-fade-in">
                        {item.dropdown.map((sub, si) => (
                          <Link
                            key={si}
                            to={sub.path}
                            className="d-block px-3 py-2 fs-6 fw-semibold text-secondary hover-bg-orange hover-text-orange transition"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* RIGHT ACTION */}
          <div className="d-none d-lg-flex align-items-center gap-3">

            {!isLoggedIn ? (

              <>
                <Link to="/myprofile" className="header-btn">
                  <i className="fa fa-user"></i> Post Your Requirment
                </Link>

                {/* <Link to="/submit-property" className="header-btn">
                   <i className="fa fa-user"></i>Post Free Ad
                </Link> */}
              </>

            ) : (

              <div
                className="account-menu"
                onClick={() => setAccountOpen(!accountOpen)}
              >

                <div className="account-name">
                  <img
                    src="https://secure.gravatar.com/avatar/acdf12d667e4832f89557e59b372a6281368a9dded4cc78c16e068684502b94e?s=32"
                    alt=""
                  />
                  My Account <i class="fa-solid fa-chevron-down"></i>
                </div>

                {accountOpen && (

                  <ul className="account-dropdown">

                    {/* <li><Link to="/my-responses">View Response</Link></li> */}

                    <li><Link to="/my-properties">My Properties</Link></li>

                    <li><Link to="/my-bookmarks">Bookmarks</Link></li>

                    <li><Link to="/my-profile">My Profile</Link></li>

                    {/* <li><Link to="/change-phone">Change Phone</Link></li> */}

                    <li
                      onClick={() => {
                      localStorage.removeItem("user");
                      localStorage.removeItem("token");

                      // update header state
                      window.dispatchEvent(new Event("authChanged"));

                      // ✅ redirect to login page
                      navigate("/myprofile");
                    }}
                  >
                    Logout
                  </li>

                  </ul>

                )}

              </div>

            )}

          </div>
        </div>

        {/* MOBILE SIDEBAR */}
        {mobileMenuOpen && (
          <div className="position-fixed inset-0 bg-black bg-opacity-50 z-9999 d-lg-none" onClick={() => setMobileMenuOpen(false)}>
            <div className="position-absolute start-0 top-0 h-100 mobile-sidebar bg-white p-3 shadow" onClick={e => e.stopPropagation()}>
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3 fw-bold text-orange">
                MENU <span className="cursor-pointer text-dark" onClick={() => setMobileMenuOpen(false)}>✕</span>
              </div>
              <ul className="list-unstyled">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    {item.dropdown ? (
                      <div
                        className="d-flex justify-content-between align-items-center py-3 fw-bold text-dark"
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                      >
                        {item.title}
                        <i className={`fa-solid fa-chevron-${openDropdown === index ? "up" : "down"}`}></i>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className="d-block py-3 fw-bold text-dark"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    )}
                    {openDropdown === index && (
                      <div className="bg-light rounded ps-3 mb-2">
                        {item.dropdown.map((sub, si) => (
                          <Link key={si} to={sub.path} className="d-block py-3 fs-6 text-secondary border-bottom last-border-0" onClick={() => setMobileMenuOpen(false)}>
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default Header;