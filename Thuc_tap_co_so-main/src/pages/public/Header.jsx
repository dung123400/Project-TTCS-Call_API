import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import '../../styles/public/Header.css';
import logo from './assets/sp-logo-2.png';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate(); 

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/home?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <header className="header">
      {/* Logo Section */}
      <div className="header__logo">
        <Link to="/home" className="header__logo-link">
          <h2 className="header__logo-title">
            <img src={logo} alt="logo" className="header__logo-img"/>
            ShopZone
          </h2>
        </Link>
      </div>
      
      {/* Search Section */}
      <div className="header__search">
        <input 
          type="text" 
          placeholder="Nhập tên sản phẩm, thương hiệu ..." 
          className="header__search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
          onKeyDown={handleKeyDown} 
        />
        <i 
          className='bx bx-search header__search-icon' 
          onClick={handleSearch} 
        ></i>
      </div>

      {/* Actions/Options Section */}
      <div className="header__actions">
        {/* Notifications */}
        <div className="header__tooltip-container">
          <i className='bx bx-bell header__icon'></i>
          <div className="header__notifications">
            <p className="header__notifications-header">Bạn có thông báo mới!</p>
            <div className="header__notifications-scroll">
              <div className="header__notifications-list">
                <div className="header__notifications-item">Bạn đã trả sách thành công!</div>
                <div className="header__notifications-item">Bạn đã trả sách thành công!</div>
                <div className="header__notifications-item">Có 2 cuốn sách sắp đến hạn phải trả!</div>
                <div className="header__notifications-item">Bạn đã đặt sách thành công!</div>
                <div className="header__notifications-item">Bạn đã đặt sách thành công!</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cart */}
        <Link to="/cart" className="header__action-link">
          <div className="header__tooltip-container">
            <i className='bx bx-cart header__icon'></i>
            <span className="header__tooltip-text">Giỏ hàng</span>
          </div>
        </Link>
        
        {/* Account */}
        <Link to="/account" className="header__action-link">
          <div className="header__tooltip-container">
            <i className='bx bx-user header__icon'></i>
            <span className="header__tooltip-text">Trang cá nhân</span>
          </div>
        </Link>
      </div>
    </header>
  )
}