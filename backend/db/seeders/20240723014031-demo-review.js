'use strict';

// /** @type {import('sequelize-cli').Migration} */ //what is this?

const { Review } = require('../models');
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

    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 1,
        review: "We stays here, precious, but we don’t likes it! Too much sunlight, yes, yes, hurts our eyes! Hobbitses thinks it’s cute, but it’s too green, too fresh, too full of nasty flowers. No dark corners for us to hide, no caves, no... fish! They call it peaceful, we call it BORING, precious. They even ask if we want breakfast (yes!), but no raw fish, just bread and cheese. Nasty hobbitses. Would not recommend for those who prefer the damp and cold. Two stars only because they lets us keep the shiny... but don’t tell them!",
        stars: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        spotId: 1,
        review: "This humble abode is perfect for wizards needing a break from meddling in the affairs of others. I’ve been here countless times, and I must say, it remains as charming as ever. The fireplace is excellent for pipe-weed contemplation, and there’s no shortage of ale in Hobbiton’s taverns. Though, I must warn you, if you're looking for a place where things happen, this is not the spot—quiet and peaceful, perhaps too much so for those used to fending off Balrogs. Ideal for wizards, hobbits, and anyone fond of staying off the beaten path. Highly recommended!",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        spotId: 1,
        review: "As a native of Hobbiton, I must say this hobbit hole has a lot going for it—cozy atmosphere, lovely round doors, and the garden is well-kept (though not quite as nice as my dear Sam’s, but I won’t hold that against them). It’s peaceful, and you won’t find any dark riders chasing you around here. Only downside? No second breakfast was included! Also, the distance to Mordor is considerably more than a casual stroll. Overall, a great spot for a quiet getaway, assuming you don’t have the One Ring weighing you down.",
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Great location, very modern.',
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        spotId: 2,
        review: 'Great place, very cozy!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Nice and modern apartment.',
        stars: 4,
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
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2] }
    }, {})
  }
};
