import React, { useState, useEffect } from "react";
import "./Home.css";
import BannerImg1 from "./Home-Images/BannerImg1.jpg";
import BannerImg2 from "./Home-Images/BannerImg2.jpg";
import BannerImg3 from "./Home-Images/BannerImg3.jpg";
import BannerImg4 from "./Home-Images/BannerImg4.jpg";
import BannerImg5 from "./Home-Images/BannerImg5.jpg";
import CusSupport from "./Home-Images/cusSupport.png";
import Quality from "./Home-Images/quality.png";
import Warranty from "./Home-Images/warranty.png";
import PowerSaving from "./Home-Images/powerSaving.png";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: BannerImg1,
      title: "Power Your Future with Solar Energy",
      subtitle: "Leading Solar Solutions in Sri Lanka",
      description:
        "Transform your home and business with sustainable solar power systems. Join thousands of satisfied customers who've made the switch to clean, renewable energy.",
      buttonText: "Get Free Quote",
      highlight: "Save up to 80% on electricity bills",
    },
    {
      image: BannerImg2,
      title: "Professional Solar Installation",
      subtitle: "Expert Team • Quality Guarantee",
      description:
        "Our certified engineers provide complete solar panel installation services with 25-year warranty. From residential rooftops to commercial complexes.",
      buttonText: "View Our Work",
      highlight: "1000+ Successful Installations",
    },
    {
      image: BannerImg3,
      title: "Smart Solar Management System",
      subtitle: "Monitor & Control Your Energy",
      description:
        "Advanced ERP system to track your solar energy production, consumption, and savings in real-time. Optimize your energy usage with intelligent analytics.",
      buttonText: "Learn More",
      highlight: "Real-time Energy Monitoring",
    },
    {
      image: BannerImg4,
      title: "Eco-Friendly Energy Solutions",
      subtitle: "For a Sustainable Tomorrow",
      description:
        "Reduce your carbon footprint while saving money. Our premium solar panels are designed to withstand Sri Lankan weather conditions for decades.",
      buttonText: "Calculate Savings",
      highlight: "25+ Years Lifespan Guarantee",
    },
    {
      image: BannerImg5,
      title: "Complete Solar Packages",
      subtitle: "Affordable • Reliable • Efficient",
      description:
        "Choose from our range of solar packages designed for homes, businesses, and industries. Flexible payment plans and government subsidies available.",
      buttonText: "View Packages",
      highlight: "Starting from Rs. 150,000",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Increased to 6 seconds for better content reading

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div>
      <div
        id="default-carousel"
        className="relative w-full"
        data-carousel="slide"
      >
        {/* Carousel wrapper */}
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`banner-slide duration-700 ease-in-out ${
                index === currentSlide ? "active" : "hidden"
              }`}
              data-carousel-item
            >
              <img
                src={slide.image}
                className="absolute block w-full h-full object-cover"
                alt={`Selfme.lk Solar - ${slide.title}`}
              />

              {/* Content Overlay */}
              <div className="banner-overlay">
                <div className="banner-content">
                  {/* Company Badge */}
                  {/* <div className="company-badge">
                  <span className="company-name">Selfme.lk</span>
                  <span className="company-tagline">Solar Solutions</span>
                </div> */}

                  {/* Main Content */}
                  <div className="content-wrapper">
                    <h1 className="banner-title">{slide.title}</h1>
                    <h2 className="banner-subtitle">{slide.subtitle}</h2>
                    <p className="banner-description">{slide.description}</p>

                    {/* Highlight Badge */}
                    <div className="highlight-badge">
                      <span className="highlight-text">
                        ✨ {slide.highlight}
                      </span>
                    </div>

                    {/* Call to Action */}
                    <div className="banner-actions">
                      <button className="cta-button primary">
                        {slide.buttonText}
                      </button>
                      <button className="cta-button secondary">
                        Contact Us
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="service-box-section">
        <div className="service-box">
          <img src={Warranty} alt="Warranty Icon" />
          <h2>Trust & Warranty</h2>
          <p>
            Our products come with comprehensive warranties to ensure your peace
            of mind and long-term satisfaction with your solar investment.
          </p>
        </div>

        <div className="service-box">
          <img src={Quality} alt="Quality Icon" />
          <h2>High Quality Work</h2>
          <p>
            We use only premium materials and follow industry best practices to
            deliver solar solutions that stand the test of time.
          </p>
        </div>

        <div className="service-box">
          <img src={PowerSaving} alt="Customer Support Icon" />
          <h2>Power Saving</h2>
          <p>
            Our dedicated support team is available round the clock to address
            any questions or concerns about your solar system.
          </p>
        </div>

        <div className="service-box">
          <img src={CusSupport} alt="Customer Support Icon" />
          <h2>24/7 Support</h2>
          <p>
            Our dedicated support team is available round the clock to address
            any questions or concerns about your solar system.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
