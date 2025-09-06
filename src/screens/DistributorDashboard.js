import React, { useState, useEffect } from 'react';
import shopService from '../services/shopService';
import planService from '../services/planService';
import ShopForm from '../components/ShopForm';
import ShopList from '../components/ShopList';

const DistributorDashboard = ({ user }) => {
  const [shops, setShops] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]); // In a real app, fetch users with role 'Team Member'
  const [selectedShopIds, setSelectedShopIds] = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [planStartingPoint, setPlanStartingPoint] = useState('');
  const [planFinalDestination, setPlanFinalDestination] = useState('');
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const shopsData = await shopService.getAllShops();
      setShops(shopsData);

      // In a real app, fetch actual team members from the backend
      // For now, let's mock some team members
      // A dedicated API endpoint like /api/users?role=Team Member would be ideal
      const mockTeamMembers = [
        { _id: '60c72b2f9c1d440000a1b2c3', name: 'John Doe', email: 'john@example.com', role: 'Team Member' },
        { _id: '60c72b2f9c1d440000a1b2c4', name: 'Jane Smith', email: 'jane@example.com', role: 'Team Member' },
      ];
      setTeamMembers(mockTeamMembers);

      const allPlans = await planService.getAllPlans();
      setPlans(allPlans);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleAddShop = async (shopData) => {
    try {
      await shopService.createShop(shopData);
      fetchData(); // Re-fetch all shops to update the list
    } catch (error) {
      console.error('Error adding shop:', error);
    }
  };

  const handleShopSelect = (shopId) => {
    setSelectedShopIds((prev) =>
      prev.includes(shopId) ? prev.filter((id) => id !== shopId) : [...prev, shopId]
    );
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!selectedTeamMember || selectedShopIds.length === 0 || !planStartingPoint || !planFinalDestination) {
      alert('Please select a team member, shops, starting point, and final destination for the plan.');
      return;
    }

    try {
      const planData = {
        teamMember: selectedTeamMember,
        date: new Date().toISOString(), // Current date for the plan
        shopIds: selectedShopIds,
        startingPoint: planStartingPoint,
        finalDestination: planFinalDestination,
      };
      await planService.createPlan(planData);
      alert('Plan created successfully!');
      setSelectedShopIds([]);
      setSelectedTeamMember('');
      setPlanStartingPoint('');
      setPlanFinalDestination('');
      fetchData(); // Re-fetch plans and shop status
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create plan.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Distributor Dashboard</h2>
      <h3>Manage Shops</h3>
      <ShopForm onAddShop={handleAddShop} />
      <ShopList shops={shops} />

      <h3 style={{ marginTop: '40px' }}>Create Daily Plan</h3>
      <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}>
        <form onSubmit={handleCreatePlan}>
          <div style={{ marginBottom: '10px' }}>
            <label>Team Member:</label>
            <select
              value={selectedTeamMember}
              onChange={(e) => setSelectedTeamMember(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">Select Team Member</option>
              {teamMembers.filter(Boolean).map((member) => (
                <option key={member?._id} value={member?._id}>
                  {member?.name || 'Unknown'}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Starting Point:</label>
            <input
              type="text"
              value={planStartingPoint}
              onChange={(e) => setPlanStartingPoint(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Final Destination:</label>
            <input
              type="text"
              value={planFinalDestination}
              onChange={(e) => setPlanFinalDestination(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Select Shops for Plan:</label>
            <div style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #eee', padding: '10px' }}>
              {shops.filter(shop => !shop.isAssigned).length === 0 ? (
                <p>No unassigned shops available.</p>
              ) : (
                shops.filter(shop => !shop.isAssigned).map((shop) => (
                  <div key={shop._id} style={{ marginBottom: '5px' }}>
                    <input
                      type="checkbox"
                      id={`shop-${shop._id}`}
                      checked={selectedShopIds.includes(shop._id)}
                      onChange={() => handleShopSelect(shop._id)}
                    />
                    <label htmlFor={`shop-${shop._id}`}>{shop.name} ({shop.address})</label>
                  </div>
                ))
              )}
            </div>
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Create Plan
          </button>
        </form>
      </div>

      <h3 style={{ marginTop: '40px' }}>All Created Plans</h3>
      {plans.length === 0 ? (
        <p>No plans created yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {plans.map((plan) => (
            <li key={plan._id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
              <strong>Plan for {plan?.teamMember?.name || 'Unknown'}</strong> on {plan?.date ? new Date(plan.date).toLocaleDateString() : 'Unknown Date'} - Status: {plan?.status || '-'}
              <p>Starts: {plan?.startingPoint || '-'}, Ends: {plan?.finalDestination || '-'}</p>
              <h4>Assigned Shops:</h4>
              <ul style={{ listStyle: 'disc', marginLeft: '20px' }}>
                {Array.isArray(plan?.shops) && plan.shops.length > 0 ? (
                  plan.shops.map((s, idx) => (
                    <li key={s?.shop?._id || idx}>
                      {(s?.shop?.name || 'Unknown')} - {(s?.shop?.address || '-')} (Current Status: {s?.shop?.status || '-'}, Last Visited: {s?.shop?.lastVisited ? new Date(s.shop.lastVisited).toLocaleDateString() : 'Never'})
                    </li>
                  ))
                ) : (
                  <li>No shops assigned.</li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DistributorDashboard;