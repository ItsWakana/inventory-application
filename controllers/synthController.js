const Synthesizer = require("../models/Synthesizer");
const Brand = require("../models/Brand");
const SynthType = require("../models/SynthType");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const index = asyncHandler( async (req, res, next) => {

    const [
        synthesizerCount,
        brandCount, 
        synthTypeCount
    ] = await Promise.all([
        Synthesizer.countDocuments().exec(),
        Brand.countDocuments().exec(),
        SynthType.countDocuments().exec()

    ]);

    res.render('index', {
        title: "Sergio's Synthesizer Store",
        synthesizerCount: synthesizerCount,
        brandCount: brandCount,
        synthTypeCount: synthTypeCount
    });
});

const getSynthList = asyncHandler( async (req, res, next) => {

    const synthesizers = await Synthesizer.find({})
            .populate('brand')
            .populate('synthType')
            .exec();

    res.render('synthesizers', {
         synthesizers: synthesizers, 
         title: "Sergio's Synthesizer Store", 
    });
});

module.exports = {
    index,
    getSynthList
}