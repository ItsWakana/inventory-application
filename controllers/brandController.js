const Brand = require("../models/Brand");
const Synthesizer = require("../models/Synthesizer");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const brandListGet = asyncHandler( async(req, res, next) => {

    const allBrands = await Brand.find({})
        .sort({ name: 1 })
        .exec();

    res.render("brand-list", { 
        title: "Sergio's Synthesizer Store",
        allBrands: allBrands
    });
});

const brandDetailGet = asyncHandler( async (req, res, next) => {

    //render an individual brand page along with the list of all of the synthesizers that are under that brand.

    const { brandName } = req.params;

    const formattedName = brandName[0].toUpperCase() + brandName.slice(1);

    const foundBrand = await Brand.findOne({ name: formattedName }).exec();

    if (!foundBrand) {
        const err = new Error("Brand not found");
        err.status = 404;
        return next(err);
    }

    const allSynthsByBrand = await Synthesizer.find({ brand: foundBrand._id }).exec();

    res.render("brand-page", {
        title: "Sergio's Synthesizer Store",
        brand: foundBrand,
        synthesizers: allSynthsByBrand        
    });
});

const brandDeletePost = asyncHandler( async (req, res, next) => {

    //we need to get the brand, and we need to get all the synths which have this brand listed. Then we need to check if the synth list for this brand is empty, if its empty we can go ahead and delete it. If its not empty we don't want to remove it.

    const { brandName } = req.params;

    const formattedName = brandName[0].toUpperCase() + brandName.slice(1);
    const foundBrand = await Brand.findOne({ name: formattedName }).exec();

    const allSynthsByBrand = await Synthesizer.find({ brand: foundBrand._id }).exec();

    if (allSynthsByBrand.length > 0) {
        res.send('THERE ARE SYNTHS THAT ALREADY EXIST WITH THIS BRAND')
    }


});

module.exports = {
    brandListGet,
    brandDetailGet,
    brandDeletePost
}
