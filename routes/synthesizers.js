const express = require("express");
const router = express.Router();
const { 
    getSynthList, 
    synthDetailGet,
    synthCreateGet, 
    synthCreatePost,
    synthUpdatePost
} = require("../controllers/synthController");

const { brandListGet } = require("../controllers/brandController");

router.get("/", getSynthList);


router.get("/create", synthCreateGet);

router.post("/create", synthCreatePost);

router.get("/brands", brandListGet);

router.get("/:synthId/update", synthDetailGet);

router.post("/:synthId/update", synthUpdatePost)

// router.get("/:synthId/delete");

// router.get("/:synthId/update");

// we want to be able to have a seperate route that displays us the synthesizers by the brand name. f.ex /brand/exampleBrandName

//BRANDS


// router.get("/brands/create");

// router.get("/brands/:brandId/delete");

// router.get("/brands/:brandId/update");
module.exports = router;