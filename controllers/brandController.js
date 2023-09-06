const Brand = require("../models/Brand");
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

module.exports = {
    brandListGet
}
