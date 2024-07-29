const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, SpotImage, ReviewImage, Spot, Review, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
// router.use(express.json());


//get all spots ******************************************************
router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage,
            }
        ]
    });

    const allSpotsCopy = [];

    allSpots.forEach(spot => {
        let starsArr = [];
        let spotCopy = spot.toJSON();

        for (let review of spot.Reviews) {
            starsArr.push(review.stars);
        }

        const sumStars = starsArr.reduce((acc, curr) => acc + curr,);

        spotCopy.avgRating = sumStars/spot.Reviews.length;
        delete spotCopy.Reviews;

        let spotUrl;
        for (let image of spot.SpotImages) {
            spotUrl = image.url;
        }

        spotCopy.previewImage = spotUrl;
        delete spotCopy.SpotImages;

        allSpotsCopy.push(spotCopy)
    })

    res.json({"Spots": allSpotsCopy });

})

//get all spots owned/created by the current user ********************
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const userSpots = await Spot.findAll({
            where: {
                ownerId: user.id
            },
            include: [
                {
                    model: Review
                },
                {
                    model: SpotImage,
                }
            ]
        })

        const allSpotsCopy = [];

    userSpots.forEach(spot => {
        let starsArr = [];
        let spotCopy = spot.toJSON();

        for (let review of spot.Reviews) {
            starsArr.push(review.stars);
        }

        const sumStars = starsArr.reduce((acc, curr) => acc + curr,);

        spotCopy.avgRating = sumStars/spot.Reviews.length;
        delete spotCopy.Reviews;

        let spotUrl;
        for (let image of spot.SpotImages) {
            spotUrl = image.url;
        }

        spotCopy.previewImage = spotUrl;
        delete spotCopy.SpotImages;

        allSpotsCopy.push(spotCopy)
    })

    res.json({"Spots": allSpotsCopy });

    } else res.json({ user: null })
})

//get details of a spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spotFromId = await Spot.findOne({
        where: {
            id: req.params.spotId
        },
        include: [ SpotImage, User, Review ]
    });

    if (!spotFromId) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
          })
    }
    const owner = await User.findOne({
        where: {
            id: spotFromId.ownerId
        },
        attributes: {
            exclude: ['username']
        }
    })

    const spotImages = await SpotImage.findAll({
        where: {
            spotId: req.params.spotId
        },
        attributes: {
            exclude: ['spotId', 'createdAt', 'updatedAt']
        }
    });

    const spotCopy = spotFromId.toJSON();

    spotCopy.numReviews = spotFromId.Reviews.length;

    let starsArr = [];

    for (let review of spotFromId.Reviews) {
        starRating = review.stars;
        starsArr.push(starRating);
    }

    const sumStars = starsArr.reduce(
        (acc, curr) => acc + curr,);

    spotCopy.avgStarRating = sumStars/spotCopy.numReviews;

    delete spotCopy.Reviews;

    spotCopy.SpotImages = spotImages
    delete spotCopy.Images

    spotCopy.Owner = owner
    delete spotCopy.User

    return res.json(spotCopy);
})

//get all reviews from an spot's id ***********************************
router.get('/:spotId/reviews', async (req, res, next) => {

    const spotFromId = await Spot.findByPk(req.params.spotId);

    if (!spotFromId) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
          })
    }

    const reviewsOfSpot = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [ {
            model: User,
            attributes: {
                exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
            }
         },
         {
            model: ReviewImage,
            attributes: {
                exclude: ['reviewId', 'createdAt', 'updatedAt']
            }
         }]
    });


    return res.json({ Reviews: reviewsOfSpot });
})

//Get all Bookings for a Spot based on the Spot's id*************
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {

    const { user } = req;
    const spotFromId = await Spot.findOne({
        where: {
            id: req.params.spotId
        },
    });

    if (!spotFromId) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
          })
    }
    // console.log(spotFromId.ownerId)
    // console.log(user.id)

    if (spotFromId.ownerId !== user.id) {
        const bookingsOfSpot = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            },
            attributes: {
                exclude: ['userId', 'createdAt', 'updatedAt']
            }
        });

        return res.json({ Bookings: bookingsOfSpot });
    }

    if (spotFromId.ownerId === user.id) {
        const bookingsOfOwner = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            },
            attributes: {
                include: ['id']
            }
        });


        const users = await User.findAll({
            attributes: {
                exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
            }
        })

        let userIds = [];
        // let bookingUsers = [];
        let bookingsOfOwnerCopy = [];
        let finalCopy = [];

        for(let bookings of bookingsOfOwner) {
            userIds.push(bookings.userId)
        }
        // console.log(userIds)

        for (let booking of bookingsOfOwner) {
            for (let bookingUser of users) {
                if (userIds.includes(bookingUser.id)) {
                    let bookingCopy = booking.toJSON();
                    let bookingUserCopy = bookingUser.toJSON();
                    bookingCopy.User = bookingUserCopy;
                    bookingsOfOwnerCopy.push(bookingCopy)
                }
            }
        }

        for (let i = 0; i < bookingsOfOwnerCopy.length; i++) {
            if (bookingsOfOwnerCopy[i].userId === bookingsOfOwnerCopy[i].User.id) {
                finalCopy.push(bookingsOfOwnerCopy[i]);
            }
        }


        // // return res.json(bookingUsers)
        return res.json({ Bookings: finalCopy})
        // return res.json({ Bookings: bookingsOfOwnerCopy})

    }




})


//create a review from an spot's id ***********************************
const validateReview = [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .isInt({min: 1, max: 5})
      .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
  ];

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {

    const { review, stars } = req.body;
    const { user } = req;

    const spotFromId = await Spot.findByPk(req.params.spotId);

    const spotReviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        }
    })

    if (!spotFromId) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
        })
    }

    for (let review of spotReviews) {
        if (review.userId = user.id) {
            res.status(500);
            return res.json({
                "message": "User already has a review for this spot"
              })
        }
    }

    const newReview = await Review.create({
        userId: user.id,
        spotId: req.params.spotId,
        review,
        stars,
        createdAt: new Date(),
        updatedAt: new Date()
    })

    res.status(201);
    return res.json(newReview);
})

//create a spot ******************************************************
//NOTE, might need to switch to express validators to get a 400 error code
router.post('/', requireAuth,
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const { user } = req;

        let userId;

        if (user) {
            userId = user.id;
        }
        const spot = await Spot.create({ ownerId: userId, address, city, state, country, lat, lng, name, description, price });

        res.status(201);
        return res.json(spot)
    }
)

//add an image to a spot based on the spot's id *************************
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body;

    const spotForPic = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });

    if (!spotForPic) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
          })
    }

    const newSpotImage = await SpotImage.create({ spotId: req.params.spotId, url, preview })

    newImageCopy = newSpotImage.toJSON();
    delete newImageCopy.spotId;
    delete newImageCopy.updatedAt;
    delete newImageCopy.createdAt;

    res.json(newImageCopy)
})

//edit a spot ***********************************************************
router.put('/:spotId', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const updatedSpot = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    })

    if (!updatedSpot) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
          })
    }

    updatedSpot.set({ address, city, state, country, lat, lng, name, description, price });

    await updatedSpot.save();

    res.json(updatedSpot);

})

//delete a spot ***********************************************
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spotFromId = await Spot.findOne({
        where: {
            id: req.params.spotId
        },
        // include: [ Image, User, Review ]
    });

    if (!spotFromId) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
          })
    }

    await spotFromId.destroy();
    res.status(200);
    res.json({ "message": "Successfully deleted" })

})


module.exports = router;
