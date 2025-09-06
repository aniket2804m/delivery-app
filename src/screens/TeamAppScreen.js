import React, { useState, useEffect } from 'react';
import planService from '../services/planService';
import shopService from '../services/shopService';

const TeamAppScreen = ({ user }) => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedShopForVisit, setSelectedShopForVisit] = useState(null);
  const [visitStatus, setVisitStatus] = useState('Open');
  const [visitRemarks, setVisitRemarks] = useState('');

  useEffect(() => {
    fetchMyDayPlan();
  }, []);

  const fetchMyDayPlan = async () => {
    setLoading(true);
    setError('');
    try {
      const plan = await planService.getMyDayPlan();
      setCurrentPlan(plan);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('No plan assigned for you today.');
        setCurrentPlan(null);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch your plan.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlanStatus = async (status) => {
    try {
      await planService.updatePlanStatus(currentPlan._id, status);
      fetchMyDayPlan(); // Re-fetch to update status
      alert(`Plan status updated to ${status}!`);
    } catch (err) {
      alert(`Failed to update plan status: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleUpdateVisit = async (e) => {
    e.preventDefault();
    if (!selectedShopForVisit) return;

    try {
      await shopService.updateShopVisitDetails(selectedShopForVisit._id, {
        status: visitStatus,
        visitRemarks,
      });
      alert('Shop visit details updated successfully!');
      setSelectedShopForVisit(null); // Close the form
      setVisitStatus('Open');
      setVisitRemarks('');
      fetchMyDayPlan(); // Re-fetch plan to get updated shop details
    } catch (err) {
      alert(`Failed to update visit: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading your daily plan...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>My Daily Plan ({new Date(currentPlan.date).toLocaleDateString()})</h2>
      <p><strong>Status:</strong> {currentPlan.status}</p>
      <p><strong>Starting Point:</strong> {currentPlan.startingPoint}</p>
      <p><strong>Final Destination:</strong> {currentPlan.finalDestination}</p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => handleUpdatePlanStatus('In Progress')}
          disabled={currentPlan.status !== 'Planned'}
          style={{ padding: '10px 15px', marginRight: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Start Journey
        </button>
        <button
          onClick={() => handleUpdatePlanStatus('Completed')}
          disabled={currentPlan.status !== 'In Progress'}
          style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Complete Plan
        </button>
      </div>

      <h3 style={{ marginTop: '30px' }}>Shops for Today:</h3>
      {currentPlan.shops.length === 0 ? (
        <p>No shops assigned for today's plan.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {currentPlan.shops.map(({ shop }) => (
            <li key={shop._id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
              <strong>{shop.name}</strong> - {shop.address} <br />
              Contact: {shop.contact} <br />
              Current Status: {shop.status} <br />
              Last Visit Remarks: {shop.visitRemarks || 'N/A'} <br />
              Last Visited: {shop.lastVisited ? new Date(shop.lastVisited).toLocaleString() : 'Never'}
              <button
                onClick={() => {
                  setSelectedShopForVisit(shop);
                  setVisitStatus(shop.status);
                  setVisitRemarks(shop.visitRemarks);
                }}
                style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
              >
                Update Visit
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedShopForVisit && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#e9f7ff' }}>
          <h3>Update Visit for {selectedShopForVisit.name}</h3>
          <form onSubmit={handleUpdateVisit}>
            <div style={{ marginBottom: '10px' }}>
              <label>Shop Status:</label>
              <select name="status" value={visitStatus} onChange={(e) => setVisitStatus(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Permanently Shut">Permanently Shut</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Visit Remarks:</label>
              <textarea name="visitRemarks" value={visitRemarks} onChange={(e) => setVisitRemarks(e.target.value)} style={{ width: '100%', padding: '8px' }}></textarea>
            </div>
            {/* Add photo upload input here in future */}
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
              Save Visit
            </button>
            <button type="button" onClick={() => setSelectedShopForVisit(null)} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Placeholder for Map View, Journey Modes, etc. */}
      <h3 style={{ marginTop: '50px' }}>Map View & Optimization (Future Feature)</h3>
      <p>
        Here, a map (e.g., Google Maps) would display your starting point, assigned shops, and final destination.
        The "Optimized Routes" feature would calculate and draw the shortest/fastest path.
        "Time Estimation" and "Journey Modes" (Walk/Bike/Vehicle) would also be integrated here.
      </p>

      <h3 style={{ marginTop: '30px' }}>Offline Updates (Future Feature)</h3>
      <p>
        In a future iteration, this app would store visit data locally (e.g., using IndexedDB) when there's no internet connection.
        Once online, it would automatically sync the pending updates to the backend.
      </p>

    </div>
  );
};

export default TeamAppScreen;