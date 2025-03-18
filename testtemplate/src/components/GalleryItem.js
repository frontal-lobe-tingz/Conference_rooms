import React from 'react';
import Fancybox from 'react-fancybox';
import 'react-fancybox/lib/fancybox.css';

function GalleryItem({ image }) {
  return (
    <Fancybox
      thumbnail={require(`../assets/images/${image}`)}
      image={require(`../assets/images/${image}`)}
    />
  );
}

export default GalleryItem;
