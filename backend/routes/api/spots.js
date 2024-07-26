const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, SpotImage, Spot, Review } = require('../../db/models');
const router = express.Router();
router.use(express.json());


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
router.get('/current', async (req, res) => {
    const { user } = req;

    if (user) {
        const userSpots = await Spot.findAll({
            where: {
                ownerId: user.id
            }
        })

        res.json({ Spots: userSpots });
    } else res.json({ user: null })
})

//get details of a spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spotFromId = await Spot.findOne({
        where: {
            id: req.params.spotId
        },
        include: [ Image, User, Review ]
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

    const spotImages = await Image.findAll({
        where: {
            imageableId: req.params.spotId
        },
        attributes: {
            exclude: ['imageableId', 'imageableType', 'createdAt', 'updatedAt']
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

    res.json(spotCopy);
    // res.json(spotImages);
    // res.json(starsArr);
})

//create a spot *******************************************
// const validateNewSpot = [
//     check('address')
//     .exists({ checkFalsy: true })
//     .withMessage('Street address is required'),
//   check('city')
//     .exists({ checkFalsy: true })
//     // .isLength({ min: 4 })
//     .withMessage('City is required'),
//   check('state')
//     .withMessage('State is required'),
//   check('country')
//     .exists({ checkFalsy: true })
//     .withMessage('Country is required'),
//   check('lat')
//     .exists({ checkFalsy: true }),
//     .max({}),
//     .withMessage('Country is required'),
//   check('country')
//     .exists({ checkFalsy: true })
//     .withMessage('Country is required'),
//   check('country')
//     .exists({ checkFalsy: true })
//     .withMessage('Country is required'),
//   check('country')
//     .exists({ checkFalsy: true })
//     .withMessage('Country is required'),
//   handleValidationErrors
// ];

router.post('/', /* validateNewSpot, */
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const spot = await Spot.create({ ownerId: 1, address, city, state, country, lat, lng, name, description, price });

        const validSpot = {
            ownerId: 1,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        return res.json(spot)
    }
)

//delete a spot ***********************************************
router.delete('/:spotId', async (req, res, next) => {
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
