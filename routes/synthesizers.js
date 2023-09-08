const express = require("express");
const router = express.Router();
const { 
    getSynthList, 
    synthDetailGet,
    synthCreateGet, 
    synthCreatePost,
    synthUpdatePost,
    synthDeleteGet,
    synthDeletePost
} = require("../controllers/synthController");

const { 
    brandListGet,
    brandDetailGet,
    brandDeletePost
} = require("../controllers/brandController");

router.get("/", getSynthList);


router.get("/create", synthCreateGet);

router.post("/create", synthCreatePost);

router.get("/brands", brandListGet);

router.get("/:synthId/update", synthDetailGet);

router.post("/:synthId/update", synthUpdatePost);

router.get("/:synthId/delete", synthDeleteGet);

router.post("/:synthId/delete", synthDeletePost);

// we want to be able to have a seperate route that displays us the synthesizers by the brand name. f.ex /brand/exampleBrandName

//BRANDS

router.get("/brands/:brandName", brandDetailGet);

router.post("/brands/:brandName/delete", brandDeletePost);

// router.get("/brands/create");

// router.get("/brands/:brandId/delete");

// router.get("/brands/:brandId/update");
module.exports = router;