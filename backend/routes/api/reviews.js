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

//add an image to a review based on the reviews's id *************************
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body;
    const { user } = req;

    const reviewForPic = await Review.findOne({
        where: {
            id: req.params.reviewId
        }
    });

    if (!reviewForPic) {
        res.status(404);
        return res.json({
            "message": "Review couldn't be found"
          })
    }

    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId: req.params.reviewId
        }
    })

    if (reviewImages.length > 10) {
        res.status(403);
        return res.json({
            "message": "Maximum number of images for this resource was reached"
          })
    }


    const newReviewImage = await ReviewImage.create({ reviewId: req.params.reviewId, url })

    const newImageCopy = newReviewImage.toJSON();

    delete newImageCopy.reviewId;
    delete newImageCopy.updatedAt;
    delete newImageCopy.createdAt;

    res.json(newImageCopy)
})

//edit a Review ***********************************************************
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
