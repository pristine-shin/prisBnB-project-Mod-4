const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const router = express.Router();
router.use(express.json());

//get all spots
router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll();

    res.json({"Spots": allSpots });
})

module.exports = router;
