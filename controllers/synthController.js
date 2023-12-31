const Synthesizer = require("../models/Synthesizer");
const Brand = require("../models/Brand");
const SynthType = require("../models/SynthType");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const formatNames = require("../Helper Functions/formatNames");

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

    const formattedSynths = synthesizers.map((synth) => {

        const formattedName = synth.name.split(' ').map((item) => item[0].toUpperCase() + item.slice(1)).join(' ');

        const formattedBrandName = synth.brand.name.split(' ').map((item) => item[0].toUpperCase() + item.slice(1)).join(' ');

        const formattedBrand = {
            ...synth.brand.toObject(),
            name: formattedBrandName
        }

        return {
            ...synth.toObject(),
            name: formattedName,
            brand: formattedBrand
        };
    });

    res.render('synthesizers', {
         synthesizers: formattedSynths, 
         title: "Sergio's Synthesizer Store", 
    });
});


const synthDetailGet = asyncHandler( async (req, res, next) => {
    const id = req.params.synthId;

    if (!mongoose.isValidObjectId(id)) {
        res.redirect("/synthesizers");
    }

    const [
        foundSynth,
        allBrands,
        allSynthTypes
    ] = await Promise.all([
        Synthesizer.findOne({ _id: id })
            .populate("brand")
            .populate("synthType")
            .exec(),
        Brand.find({}).exec(),
        SynthType.find({}).exec()
    ]);

    if (!foundSynth) {
        res.redirect("/synthesizers");
    } 

    const formattedBrands = formatNames(allBrands);

    res.render("synth-detail", {
        title: "Sergio's Synthesizer Store", 
        synthesizer: foundSynth,
        allBrands: formattedBrands,
        allSynthTypes: allSynthTypes
    });

    //in the detail render we can provide a form with all the fields filled out with what the user entered previously. We can include a update button the user can click to change the details of the synth.
});

const synthUpdatePost = [

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

        const id = req.params.synthId;

        const synth = new Synthesizer({
            name: req.body.synthName,
            brand: req.body.brand,
            synthType: req.body.synthType,
            releaseYear: req.body.releaseYear,
            price: req.body.price,
            stock: req.body.stock,
            url: req.body.url,
            _id: id
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
            await Synthesizer.updateOne({_id: id}, synth)
            res.redirect("/synthesizers");
        }
    }),


]

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
        synthesizer: null,
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
    body("brand", "brand must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("synthType", "synthType must not be empty")
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

const synthDeleteGet = asyncHandler( async (req, res, next) => {

    const id = req.params.synthId;

    if (!mongoose.isValidObjectId(id)) {
        res.redirect("/synthesizers");
    }

    const foundSynth = await Synthesizer.findById(id)
        .populate("brand")
        .populate("synthType")
        .exec()

    res.render("synth-delete", {
        title: "Sergio's Synthesizer Store", 
        synthesizer: foundSynth
    });

});
const synthDeletePost = asyncHandler( async (req, res, next) => {
    const id = req.params.synthId;

    if (!mongoose.isValidObjectId(id)) {
        res.redirect("/synthesizers");
    }
    await Synthesizer.findByIdAndRemove(id);

    res.redirect("/synthesizers");

});

module.exports = {
    index,
    getSynthList,
    synthDetailGet,
    synthCreateGet,
    synthCreatePost,
    synthUpdatePost,
    synthDeleteGet,
    synthDeletePost
}