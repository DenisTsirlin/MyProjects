import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Slider from '../components/Slider';
import Categories from '../components/Categories';
import NewsLetter from '../components/NewsLetter';
import Footer from '../components/Footer';

export default function Home() {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
    const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(totalCount);
  }, []);

  return (
    <div>
      <Announcement />
      <Navbar cartItemCount={cartItemCount} /> 
      <Slider />
      <Categories />
      <NewsLetter />
      <Footer />
    </div>
  );
}
