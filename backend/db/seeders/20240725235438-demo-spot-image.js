'use strict';

// /** @type {import('sequelize-cli').Migration} */ //what is this?

const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://example.com/cozy_cottage.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: 'https://example.com/urban_homestead_1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: 'https://example.com/urban_homestead_2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: 'https://example.com/modern_apartment_1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: 'https://example.com/modern_apartment_2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: 'https://example.com/modern_apartment_3.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://example.com/cozy_cottage.jpg','https://example.com/urban_homestead_1.jpg','https://example.com/urban_homestead_2.jpg','https://example.com/modern_apartment_1.jpg','https://example.com/modern_apartment_2.jpg','https://example.com/modern_apartment_3.jpg'] }
    }, {})
  }
};
