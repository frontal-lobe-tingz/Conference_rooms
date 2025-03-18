import React from 'react';
import OwlCarousel from 'react-owl-carousel';

function PhotosSection() {
  const options = {
    items: 1,
    loop: true,
    nav: true,
    // Other options
  };

  return (
    <section className="section slider-section bg-light">
      <div className="container">
        {/* Section content */}
        <OwlCarousel className="home-slider owl-carousel" {...options}>
          {/* Carousel items */}
          <div className="slider-item">
            <a href="images/slider-1.jpg" data-fancybox="images" data-caption="Caption for this image">
              <img src={require('../assets/images/slider-1.jpg')} alt="Slider Image" className="img-fluid" />
            </a>
          </div>
          {/* More items */}
        </OwlCarousel>
      </div>
    </section>
  );
}

export default PhotosSection;
