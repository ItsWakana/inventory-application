const Brand = require("../models/Brand");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

// we want to be able to have a seperate route that displays us the synthesizers by the brand name. f.ex /brand/exampleBrandName
