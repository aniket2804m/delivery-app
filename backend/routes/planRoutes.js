const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const Shop = require('../models/Shop'); // We need Shop model to update its status
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

// @desc    Create a new plan for a team member
// @route   POST /api/plans
// @access  Private/Distributor
router.post('/', protect, authorize(['Distributor', 'Admin']), async (req, res) => {
  const { teamMember, date, shopIds, startingPoint, finalDestination } = req.body;

  if (!teamMember || !date || !shopIds || shopIds.length === 0 || !startingPoint || !finalDestination) {
    return res.status(400).json({ message: 'Please provide all required fields for the plan.' });
  }

  try {
    // Create shop references for the plan
    const shops = shopIds.map(id => ({ shop: id }));

    const plan = new Plan({
      teamMember,
      date,
      shops,
      startingPoint,
      finalDestination,
      status: 'Planned',
    });

    const createdPlan = await plan.save();

    // Optionally update the 'isAssigned' status of the shops
    await Shop.updateMany(
      { _id: { $in: shopIds } },
      { $set: { isAssigned: true } }
    );

    res.status(201).json(createdPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all plans (for Admin/Distributor)
// @route   GET /api/plans
// @access  Private/Distributor, Admin
router.get('/', protect, authorize(['Distributor', 'Admin']), async (req, res) => {
  try {
    const plans = await Plan.find({})
      .populate('teamMember', 'name email')
      .populate('shops.shop');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get a specific plan by ID
// @route   GET /api/plans/:id
// @access  Private/Team Member, Distributor, Admin
router.get('/:id', protect, authorize(['Team Member', 'Distributor', 'Admin']), async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate('teamMember', 'name email')
      .populate('shops.shop');

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found.' });
    }

    // Ensure team member can only see their own plan unless they are a Distributor/Admin
    if (req.user.role === 'Team Member' && plan.teamMember._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only view your own plans.' });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc    Get current day's plan for the logged-in team member
// @route   GET /api/plans/my-day
// @access  Private/Team Member
router.get('/my-day', protect, authorize(['Team Member']), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    const plan = await Plan.findOne({
      teamMember: req.user._id,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate('shops.shop');

    if (plan) {
      res.json(plan);
    } else {
      res.status(404).json({ message: 'No plan found for today.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update plan status (e.g., 'In Progress', 'Completed')
// @route   PUT /api/plans/:id/status
// @access  Private/Team Member, Distributor, Admin
router.put('/:id/status', protect, authorize(['Team Member', 'Distributor', 'Admin']), async (req, res) => {
  const { status } = req.body;

  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found.' });
    }

    // Ensure team member can only update their own plan status
    if (req.user.role === 'Team Member' && plan.teamMember.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only update the status of your own plans.' });
    }

    if (!['Planned', 'In Progress', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid plan status.' });
    }

    plan.status = status;
    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;