#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

// const Book = require("./models/book");
const Synthesizer = require("./models/Synthesizer");
// const Author = require("./models/author");
const Brand = require("./models/Brand");
// const Genre = require("./models/genre");
const SynthType = require("./models/SynthType");

// const genres = [];
const synthTypes = [];
// const authors = [];
const brands = [];
// const books = [];
const synthesizers = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  // await createGenres();
  await createSynthTypes();
  await createBrands();
  await createSynthesizers();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function synthTypeCreate(index, name) {
  const synthType = new SynthType({ name: name });
  await synthType.save();
  synthTypes[index] = synthType;
  console.log(`Added synthType: ${name}`);
}

async function brandCreate(index, name, countryOfOrigin, url) {
  const branddetail = { 
    name: name,
    countryOfOrigin: countryOfOrigin,
    url: url 
  };

  const brand = new Brand(branddetail);

  await brand.save();
  brands[index] = brand;
  console.log(`Added brand: ${name}`);
}

async function synthesizerCreate(index, name, brand, releaseYear, price, stock, url, synthType) {
  const synthesizerdetail = {
    name: name,
    brand: brand,
    releaseYear: releaseYear,
    price: price,
    stock: stock,
    url: url
  };
  if (synthType != false) synthesizerdetail.synthType = synthType;

  const synth = new Synthesizer(synthesizerdetail);
  await synth.save();
  synthesizers[index] = synth;
  console.log(`Added synthesizer: ${name}`);
}

async function createSynthTypes() {
  console.log("Adding synth types");
  await Promise.all([
    synthTypeCreate(0, "Modular"),
    synthTypeCreate(1, "Workstation"),
    synthTypeCreate(2, "Keyboard"),
    synthTypeCreate(3, "Sequencer"),
  ]);
}

async function createBrands() {
  //name, country, url
  console.log("Adding brands");
  await Promise.all([
    brandCreate(0, "Roland", "Japan", "https://www.roland.com/global/"),
    brandCreate(1, "Moog", "USA", "https://www.moogmusic.com/"),
    brandCreate(2, "Sequential", "USA", "https://www.sequential.com/"),
    brandCreate(3, "Fairlight", "Australia", "https://en.wikipedia.org/wiki/Fairlight_(company)"),
    brandCreate(4, "Yamaha", "Japan", "https://uk.yamaha.com/en/products/music_production/synthesizers/index.html"),
  ]);
}

async function createSynthesizers() {
  //name, brand, releaseYear, price, stock, url, synthType
  console.log("Adding Synthesizers");
  await Promise.all([
    synthesizerCreate(0,
      "Roland Jupiter-8 Synthesizer",
      brands[0],
      1981,
      18000,
      20,
      "https://en.wikipedia.org/wiki/Roland_Jupiter-8",
      synthTypes[2]
    ),
    synthesizerCreate(1,
      "Minimoog Synthesizer",
      brands[1],
      1971,
      6999,
      15,
      "https://en.wikipedia.org/wiki/Minimoog",
      synthTypes[2]
    ),
    synthesizerCreate(2,
      "Moog Model 10 Analog Modular Synthesizer",
      brands[1],
      1971,
      11999,
      9,
      "https://en.wikipedia.org/wiki/Moog_synthesizer",
      synthTypes[0]
    ),
    synthesizerCreate(3,
      "Roland JD-800 Synthesizer",
      brands[0],
      1991,
      1099,
      22,
      "https://en.wikipedia.org/wiki/Roland_JD-800",
      synthTypes[2]
    ),
    synthesizerCreate(4,
      "Fairlight CMI",
      brands[3],
      1979,
      16000,
      4,
      "https://en.wikipedia.org/wiki/Fairlight_CMI",
      synthTypes[1]
    ),
    synthesizerCreate(5,
      "Prophet-5",
      brands[2],
      1978,
      2900,
      12,
      "https://en.wikipedia.org/wiki/Prophet-5",
      synthTypes[1]
    ),
    synthesizerCreate(6,
      "Yamaha DX7",
      brands[4],
      1983,
      250,
      25,
      "https://en.wikipedia.org/wiki/Yamaha_DX7",
      synthTypes[2]
    ),

  ]);
}
