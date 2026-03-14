import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AutoPopup.css";

export default function AutoPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    // ✅ CHECK LOGIN
    const user = localStorage.getItem("user");

    // if logged in → do nothing
    if (user) return;

    let scrollTriggered = false;

    // show after 20 sec
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 10000);

    // show on scroll
    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight -
            window.innerHeight)) *
        100;

      if (scrollPercent > 40 && !scrollTriggered) {
        scrollTriggered = true;
        setShowPopup(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // repeat every 5 minutes
    const interval = setInterval(() => {
      setShowPopup(true);
    }, 5 * 60 * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleExplore = () => {
    setShowPopup(false);
    navigate("/myprofile"); // login/register page
  };

  return (
    <>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">

            <button
              className="popup-close"
              onClick={() => setShowPopup(false)}
            >
              ✕
            </button>

            <h3>Join Us Now</h3>

            <p>
              Create your free account to contact owners,
              post properties and unlock all features.
            </p>

            <button className="popup-btn" onClick={handleExplore}>
              Register Now
            </button>

          </div>
        </div>
      )}
    </>
  );
}