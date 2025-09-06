const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

// @desc    Get all shops (Accessible by all roles who are logged in)
// @route   GET /api/shops
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // For distributors/admins, show all shops. For team members, potentially only assigned shops later.
    const shops = await Shop.find({});
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new shop
// @route   POST /api/shops
// @access  Private/Distributor, Admin
router.post('/', protect, authorize(['Distributor', 'Admin']), async (req, res) => {
  const { name, contact, address, latitude, longitude, status, remarks } = req.body;

  if (!name || !contact || !address || !latitude || !longitude) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    const shop = new Shop({
      name,
      contact,
      address,
      latitude,
      longitude,
      status,
      remarks,
    });

    const createdShop = await shop.save();
    res.status(201).json(createdShop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get shop by ID
// @route   GET /api/shops/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (shop) {
      res.json(shop);
    } else {
      res.status(404).json({ message: 'Shop not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a shop (general details, by Distributor/Admin)
// @route   PUT /api/shops/:id
// @access  Private/Distributor, Admin
router.put('/:id', protect, authorize(['Distributor', 'Admin']), async (req, res) => {
  const { name, contact, address, latitude, longitude, status, remarks, isAssigned } = req.body; // Added isAssigned

  try {
    const shop = await Shop.findById(req.params.id);

    if (shop) {
      shop.name = name || shop.name;
      shop.contact = contact || shop.contact;
      shop.address = address || shop.address;
      shop.latitude = latitude || shop.latitude;
      shop.longitude = longitude || shop.longitude;
      shop.status = status || shop.status;
      shop.remarks = remarks || shop.remarks;
      shop.isAssigned = isAssigned !== undefined ? isAssigned : shop.isAssigned; // Update isAssigned

      const updatedShop = await shop.save();
      res.json(updatedShop);
    } else {
      res.status(404).json({ message: 'Shop not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update shop visit specific details (by Team Member)
// @route   PUT /api/shops/:id/visit
// @access  Private/Team Member
router.put('/:id/visit', protect, authorize(['Team Member']), async (req, res) => {
  const { status, visitRemarks } = req.body; // Use 'status' to update shop's overall status, 'visitRemarks' for specific visit notes

  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found.' });
    }

    if (status) {
      shop.status = status; // Update general shop status
    }
    shop.visitRemarks = visitRemarks !== undefined ? visitRemarks : shop.visitRemarks; // Update visit-specific remarks
    shop.lastVisited = new Date(); // Record visit time
    // If you implemented photoProof, add photoProofUrl update here

    const updatedShop = await shop.save();
    res.json(updatedShop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// @desc    Delete a shop
// @route   DELETE /api/shops/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize(['Admin']), async (req, res) => { // Only Admin can delete
  try {
    const shop = await Shop.findById(req.params.id);

    if (shop) {
      await Shop.deleteOne({ _id: req.params.id });
      res.json({ message: 'Shop removed' });
    } else {
      res.status(404).json({ message: 'Shop not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;