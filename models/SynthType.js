const mongoose = require("mongoose");

const SynthTypeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("SynthType", SynthTypeSchema);