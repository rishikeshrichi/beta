import React from 'react'
import Menus from '../components/Menus'
import SpecialDishes from '../components/SpecialDishes'
import Hero from '../components/Hero'
import '../animation/Css/Home.css';
import Header from '../components/Header'
import Product from '../components/Product';
function Home() {
  return (
    <div className='Home'>
    <Header />
      <Hero />
      <br />
      <Product />
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx" crossorigin="anonymous"></script>
    </div>
  )
}

export default Home