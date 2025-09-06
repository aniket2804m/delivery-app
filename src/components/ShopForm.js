import React, { useState } from 'react';

const ShopForm = ({ onAddShop }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    latitude: '',
    longitude: '',
    status: 'Open',
    remarks: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert latitude and longitude to numbers
    const newShopData = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };
    onAddShop(newShopData);
    // Clear form after submission
    setFormData({
      name: '',
      contact: '',
      address: '',
      latitude: '',
      longitude: '',
      status: 'Open',
      remarks: '',
    });
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Add New Shop</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Contact:</label>
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Latitude:</label>
          <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Longitude:</label>
          <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Permanently Shut">Permanently Shut</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Remarks:</label>
          <textarea name="remarks" value={formData.remarks} onChange={handleChange} style={{ width: '100%', padding: '8px' }}></textarea>
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add Shop</button>
      </form>
    </div>
  );
};

export default ShopForm;