const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Image, Spot, Review } = require('../../db/models');
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
                model: Image,
                where: { imageableType: 'spot'}
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

        spotCopy.previewImage = allSpots.Images;
        delete spotCopy.Images;

        allSpotsCopy.push(spotCopy)
    })

    res.json({"Spots": allSpots });

})

//get all spots owned/created by the current user ********************
router.get('/current', async (req, res, next) => {
    const userSpots = await Spot.findAll({
        where: {
            //not sure about this one
        }
    });

    res.json({"Spots": userSpots });
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

module.exports = router;
