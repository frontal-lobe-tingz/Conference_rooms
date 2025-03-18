import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FilterForm from '../components/FilterForm';
import WelcomeSection from '../components/WelcomeSection';
import RoomsSection from '../components/RoomsSection';
import PhotosSection from '../components/PhotosSection';
//import MenuSection from '../components/MenuSection';
//import TestimonialsSection from '../components/TestimonialsSection';
//import EventsSection from '../components/EventsSection';
//import CallToActionSection from '../components/CallToActionSection';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <FilterForm />
      <WelcomeSection />
      <RoomsSection />
      <PhotosSection />
   
     
      
  
      <Footer />
    </div>
  );
}

export default HomePage;
