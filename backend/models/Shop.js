const mongoose = require('mongoose');

const shopSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    status: { // Overall shop status
      type: String,
      enum: ['Open', 'Closed', 'Permanently Shut'],
      default: 'Open',
    },
    remarks: { // General remarks for the shop
      type: String,
      default: '',
    },
    // New fields for team assignments and visit tracking
    isAssigned: { // To easily check if a shop is part of an active plan
      type: Boolean,
      default: false,
    },
    lastVisited: { // Timestamp of the last visit
      type: Date,
    },
    visitRemarks: { // Remarks specific to a visit (can be updated by team)
      type: String,
      default: '',
    },
    // You can also add photoProof related fields here
    // photoProofUrl: {
    //   type: String,
    //   default: '',
    // },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;