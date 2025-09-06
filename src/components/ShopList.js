import React from 'react';

const ShopList = ({ shops }) => {
  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Shop List</h2>
      {shops.length === 0 ? (
        <p>No shops added yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {shops.map((shop) => (
            <li key={shop._id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
              <strong>{shop.name}</strong> - {shop.address} <br />
              Contact: {shop.contact} <br />
              Coords: ({shop.latitude}, {shop.longitude}) <br />
              Status: {shop.status} {shop.remarks && `(${shop.remarks})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShopList;