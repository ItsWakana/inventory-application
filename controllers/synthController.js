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
            .sort({name: 1})
            .exec();

    res.render('synthesizers', {
         synthesizers: synthesizers, 
         title: "Sergio's Synthesizer Store", 
    });
});

const synthCreateGet = asyncHandler( async (req, res, next) => {

    const [
        allBrands,
        allSynthTypes
    ] = await Promise.all([
        Brand.find({}).exec(),
        SynthType.find({}).exec()
    ]);

    res.render("synth-form", {
        title: "Sergio's Synthesizer Store", 
        allBrands: allBrands,
        allSynthTypes: allSynthTypes
    })
})

module.exports = {
    index,
    getSynthList,
    synthCreateGet
}