const mongoose = require('mongoose');

const planSchema = mongoose.Schema(
  {
    teamMember: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Refers to the User model
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    shops: [ // Array of shops assigned for this plan
      {
        shop: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Shop',
          required: true,
        },
        // We can add specific visit status for this plan if needed,
        // but for simplicity, we'll update the shop's global status for now.
        // For more complex tracking, consider a separate 'Visit' model.
      },
    ],
    startingPoint: {
      type: String, // Can be updated to Lat/Long object for map integration
      required: true,
    },
    finalDestination: {
      type: String, // Can be updated to Lat/Long object for map integration
      required: true,
    },
    status: {
      type: String,
      enum: ['Planned', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Planned',
    },
    // For route optimization and time estimation, you would add fields like:
    // optimizedRoutePath: { type: String }, // GeoJSON or encoded polyline
    // estimatedDuration: { type: Number }, // in minutes
    // actualDuration: { type: Number },
    // journeyMode: { type: String, enum: ['Walk', 'Bike', 'Vehicle'] },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;