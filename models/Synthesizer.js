const mongoose = require("mongoose");

const SynthesizerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    synthType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SynthType',
        required: true
    },
    releaseYear: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Synthesizer", SynthesizerSchema);