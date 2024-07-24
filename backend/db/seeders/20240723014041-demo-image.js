'use strict';

// /** @type {import('sequelize-cli').Migration} */ //what is this?

const { Image } = require('../models');
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

    await Image.bulkCreate([
      {
        imageableId: 1,
        imageableType: 'spot',
        url: 'https://example.com/image1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableId: 2,
        imageableType: 'spot',
        url: 'https://example.com/image2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableId: 1,
        imageableType: 'review',
        url: 'https://example.com/review-image1.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageableId: 2,
        imageableType: 'review',
        url: 'https://example.com/review-image2.jpg',
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
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://example.com/review-image1.jpg', 'https://example.com/review-image2.jpg'] }
    }, {})
  }
};
