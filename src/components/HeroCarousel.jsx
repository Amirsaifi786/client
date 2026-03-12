import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import slider1 from "../assets/images/slider1.png"
import slider2 from "../assets/images/slider2.png"
import slider3 from "../assets/images/slider3.png"



function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      id: 1,
      bgImage: slider2,
      title: "Find Your Dream Home",
      propertyCount: "11336",
      description: "properties for you!"
    },
    {
      id: 2,
      bgImage: slider1,
      title: "Find Your Dream Home",
      propertyCount: "12500+",
      description: "luxury properties!"
    },
    {
      id: 3,
      bgImage: slider3,
      title: "Find Your Dream Home",
      propertyCount: "12500+",
      description: "luxury properties!"
    },
 
  ];

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const goToPrevSlide = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div id="propertyCarousel" className="carousel slide">
      {/* Dot pagination indicators */}
      {/* <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={index === activeIndex ? "active" : ""}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div> */}

      {/* Carousel items */}
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
          >
            <div
              className="parallax"
              style={{
                backgroundImage: `url("${slide.bgImage}")`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                minHeight: '500px'
              }}
            >
              <div className="parallax-overlay" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)'
              }} />
              <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '100px' }}>
                <div className="search-container text-center text-white">
                  <h2 className="display-4 fw-bold mb-4">{slide.title}</h2>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="row g-2 with-forms justify-content-center">
                      <div className="col-md-3">
                        <select className="form-select custom-input">
                          <option>Any type</option>
                          <option>Houses</option>
                          <option>Flats</option>
                          <option>Boys PG</option>
                          <option>Girls PG</option>
                          <option>Commercial</option>
                        </select>
                      </div>
                      <div className="col-md-7">
                        <select className="form-select custom-input">
                          <option>Anywhere in Jaipur</option>
                          <option>Sodala</option>
                          <option>Malviya Nagar</option>
                          <option>Vaishali Nagar</option>
                          <option>Mansarovar</option>
                        </select>
                      </div>
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
                  <div className="announce mt-4">
                    We have <strong>{slide.propertyCount}</strong> {slide.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button 
        className="carousel-control-prev" 
        type="button"
        onClick={goToPrevSlide}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button 
        className="carousel-control-next" 
        type="button"
        onClick={goToNextSlide}
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default HeroCarousel;