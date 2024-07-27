const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, ReviewImage, SpotImage, Spot, Review } = require('../../db/models');
const router = express.Router();
router.use(express.json());


//get all reviews owned/created by the current user ********************
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const userReviews = await Review.findAll({
            where: {
                userId: user.id
            },
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
                    }
                },
                {
                    model: Spot,
                    attributes: {
                        exclude: ['description', 'createdAt', 'updatedAt']
                    }
                },
                {
                    model: ReviewImage,
                    attributes: {
                        exclude: ['reviewId', 'createdAt', 'updatedAt']
                    }
                }
            ]
        })
        const reviewedSpotsImage = await SpotImage.findAll()


        let spotIds = [];
        let spotImages = []
        let userReviewsCopy = []

        for (let review of userReviews) {
            spotIds.push(review.Spot.id);
        }

        console.log(spotIds)

        for (let spotImage of reviewedSpotsImage) {
            if (spotIds.includes(spotImage.spotId)) {
                spotImages.push(spotImage)
            }
        }

        for (let review of userReviews) {
            let reviewCopy = review.toJSON();

            for (let previewImg of spotImages) {
                if (previewImg.spotId = review.Spot.id) {
                    reviewCopy.Spot.previewImage = previewImg.url;
                }
            }
            userReviewsCopy.push(reviewCopy);
        }

    // res.json(spotImages);
    return res.json({"Reviews": userReviewsCopy });
    // res.json(reviewedSpotsImage)

    } else return res.json({ user: null })
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

    res.json(spotCopy);
})

//create a spot *******************************************
router.post('/', /*requireAuth,*/
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const { user } = req;

        let userId;

        if (user) {
            userId = user.id;
        }
        const spot = await Spot.create({ ownerId: 1, address, city, state, country, lat, lng, name, description, price });

        return res.json(spot)
    }
)

//add an image to a spot based on the spot's id *************************
router.post('/:spotId/images', async (req, res) => {
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
router.put('/:spotId', async (req, res) => {
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
