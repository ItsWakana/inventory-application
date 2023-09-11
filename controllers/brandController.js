const Brand = require("../models/Brand");
const Synthesizer = require("../models/Synthesizer");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const formatNames = require("../Helper Functions/formatNames");

const brandListGet = asyncHandler( async(req, res, next) => {

    const allBrands = await Brand.find({})
        .sort({ name: 1 })
        .exec();

    const formattedBrands = formatNames(allBrands)

    res.render("brand-list", { 
        title: "Sergio's Synthesizer Store",
        allBrands: formattedBrands
    });
});

const brandDetailGet = asyncHandler( async (req, res, next) => {

    //render an individual brand page along with the list of all of the synthesizers that are under that brand.

    const { brandName } = req.params;
    const foundBrand = await Brand.findOne({ name: brandName }).exec();
    
    if (!foundBrand) {
        const err = new Error("Brand not found");
        err.status = 404;
        return next(err);
    }

    const formattedBrand = {
        ...foundBrand.toObject(),
        name: foundBrand.name,
    }

    const allSynthsByBrand = await Synthesizer.find({ brand: foundBrand._id }).exec();

    res.render("brand-page", {
        title: "Sergio's Synthesizer Store",
        brand: formattedBrand,
        synthesizers: allSynthsByBrand        
    });
});

const brandDeletePost = asyncHandler( async (req, res, next) => {

    //we need to get the brand, and we need to get all the synths which have this brand listed. Then we need to check if the synth list for this brand is empty, if its empty we can go ahead and delete it. If its not empty we don't want to remove it.

    const { brandName } = req.params;

    // const formattedName = brandName[0].toUpperCase() + brandName.slice(1);
    const foundBrand = await Brand.findOne({ name: brandName }).exec();

    const allSynthsByBrand = await Synthesizer.find({ brand: foundBrand._id }).exec();

    if (allSynthsByBrand.length > 0) {
        res.send('THERE ARE SYNTHS THAT ALREADY EXIST WITH THIS BRAND')
    } else {
        await Brand.deleteOne(foundBrand);
        res.redirect("/synthesizers/brands");
    }


});

const brandCreateGet = asyncHandler( async (req, res, next) => {

    res.render("brand-form", {
        title: "Sergio's Synthesizer Store",
        brand: null
    });
});

const brandCreatePost = [
    body("brandName", "Name must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("country", "Country must not be empty")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("url")
        .trim()
        .isLength({ min: 1})
        .escape(),

    asyncHandler( async (req, res, next) => {
        const {
            brandName,
            country,
            url
        } = req.body;

        const nameToLowerCase = brandName.toLowerCase();

        const errors = validationResult(req);

        const brand = new Brand({
            name: nameToLowerCase,
            countryOfOrigin: country,
            url
        });

        if (!errors.isEmpty()) {

            res.render("brand-form", {
                title: "Sergio's Synthesizer Store",
                brand
            })
        } else {
            await brand.save();
            res.redirect("/synthesizers/brands");
        }



        
    })
]

const brandUpdateGet = asyncHandler( async (req, res, next) => {

    const brandName = req.params.brandName;

    const foundBrand = await Brand.findOne({name: brandName}).exec()

    res.render("brand-detail", {
        title: "Sergio's Synthesizer Store",
        brand: foundBrand
    })
});

const brandUpdatePost = [
    body("brandName", "name cannot be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("country", "country cannot be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("url", "url cannot be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    
    asyncHandler( async (req, res, next) => {

        const {
            brandName,
            country,
            url
        } = req.body;

        const errors = validationResult(req);

        const brand = new Brand({

            name: brandName,
            countryOfOrigin: country,
            url: url
        });

        if (!errors.isEmpty()) {


        }
    }),
]

module.exports = {
    brandListGet,
    brandDetailGet,
    brandDeletePost,
    brandCreateGet,
    brandCreatePost,
    brandUpdateGet,
    brandUpdatePost
}
