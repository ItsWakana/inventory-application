const Synthesizer = require("../models/Synthesizer");
const Brand = require("../models/Brand");
const SynthType = require("../models/SynthType");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
        allSynthTypes: allSynthTypes,
        synthesizer: undefined,
    });
});

const synthCreatePost = [

    body("synthName", "synthName must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("releaseYear", "releaseYear must not be empty")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("price", "price must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("stock", "stock must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("url", "url must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    
    
    asyncHandler( async (req, res, next) => {
        const errors = validationResult(req);

        const synth = new Synthesizer({
            name: req.body.synthName,
            brand: req.body.brand,
            synthType: req.body.synthType,
            releaseYear: req.body.releaseYear,
            price: req.body.price,
            stock: req.body.stock,
            url: req.body.url
        });
        if (!errors.isEmpty()) {

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
                allSynthTypes: allSynthTypes,
                synthesizer: synth
            });
        } else {
            synth.save();
            res.redirect("/synthesizers");
        }
    }),
]

module.exports = {
    index,
    getSynthList,
    synthCreateGet,
    synthCreatePost
}