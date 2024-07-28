const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, SpotImage, ReviewImage, Spot, Review, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
// router.use(express.json());

//Get all of the Current User's Bookings ***********************************
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const userBookings = await Booking.findAll({
            where: {
                userId: user.id
            },
            attributes: {
                include: ['id']
            },
        })

        const allSpots = await Spot.findAll({
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt'],
            },
            include: [
                {
                    model: SpotImage,
                    attributes: {
                        exclude: ['id', 'spotId', 'preview', 'createdAt', 'updatedAt']
                    }
                }
            ]
        });

        let spotIds = [];
        let bookedSpots = [];
        let userBookingsCopy = [];

        for (let booking of userBookings) {
            spotIds.push(booking.spotId)
        }

        // console.log(spotIds);

        for (let spot of allSpots) {
            if (spotIds.includes(spot.id)) {
                bookedSpots.push(spot)
            }
        }

        for (let booking of userBookings) {
            let bookingCopy = booking.toJSON();

            for (let spot of bookedSpots) {
                let spotCopy = spot.toJSON();

                if (spot.id = booking.spotId) {
                    const { url } = spotCopy.SpotImages[0]
                    spotCopy.previewImage = url;
                }
                delete spotCopy.SpotImages;
                bookingCopy.Spot = spotCopy;
            }

            userBookingsCopy.push(bookingCopy);
        }


        return res.json({ Bookings: userBookingsCopy});

    } else return res.json({ user: null})

})




module.exports = router;
