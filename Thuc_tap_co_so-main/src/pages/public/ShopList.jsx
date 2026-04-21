import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/public/Shop.css'; // Tận dụng CSS của sốp
import avt from './assets/avt-shop.jpg';

export default function ShopList() {
    const [shops, setShops] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API lấy toàn bộ sốp từ Backend
        fetch('http://localhost:8081/api/shops')
            .then(res => res.json())
            .then(data => setShops(data))
            .catch(err => console.error("Lỗi:", err));
    }, []);

    return (
        <div className='shop-list-page' style={{padding: '120px 50px 50px'}}>
            <h2 style={{textAlign: 'center', marginBottom: '40px'}}>Hệ thống các Sốp tại ShopZone</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px'}}>
                {shops.map(s => (
                    <div key={s.shopID} className='shop-card' 
                         style={{border: '1px solid #ddd', padding: '20px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer'}}
                         onClick={() => navigate(`/shop/${s.shopID}`)}>
                        <img src={avt} alt="avt" style={{width: '80px', height: '80px', borderRadius: '50%'}} />
                        <h3 style={{color: '#ee4d2d', margin: '15px 0'}}>{s.shopName}</h3>
                        <p style={{fontSize: '14px', color: '#666'}}>{s.description || "Chưa có mô tả"}</p>
                        <div style={{marginTop: '15px'}}>⭐ {s.rating || 5.0}</div>
                        <button style={{marginTop: '15px', padding: '10px 20px', backgroundColor: '#ee4d2d', color: 'white', border: 'none', borderRadius: '5px'}}>
                            Ghé thăm sốp
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}