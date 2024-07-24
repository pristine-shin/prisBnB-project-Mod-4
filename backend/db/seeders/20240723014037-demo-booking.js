'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      console.log("Starting to seed bookings...");
      await queryInterface.bulkInsert('bookings', [
        {
          spotId: 1,
          userId: 1,
          startDate: new Date('2024-08-01'),
          endDate: new Date('2024-08-07'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          spotId: 2,
          userId: 2,
          startDate: new Date('2024-09-01'),
          endDate: new Date('2024-09-07'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
      console.log("Bookings seeded successfully.");
    } catch(err) {
      console.error("Error seeding bookings:", err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      options.tableName = 'Bookings';
      const Op = Sequelize.Op;
      console.log("Starting to delete seeded bookings...");
      return queryInterface.bulkDelete('bookings', null, {});
    } catch(err) {
      console.error("Error deleting seeded bookings:", err);
      throw err;
    }
  }
};
