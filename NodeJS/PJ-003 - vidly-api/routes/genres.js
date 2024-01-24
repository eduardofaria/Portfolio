const express = require("express");
const router = express.Router();
const Joi = require("joi");
const fs = require("fs");
const debugApi = require("debug")("app:api");

const data = JSON.parse(fs.readFileSync("./data/genres.json", "utf8"));
const genres = data.genres;

debugApi(`Available Genres List:`);
console.table(genres);

//Routes from /api/v1/genres

//GET All
router.get("/", (req, res) => {
  //res.render("index", { title: "Genres" });
  res.send(genres);
});

//GET by ID
router.get("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let found = genres.find((g) => g.id === id);
  if (!found) {
    return res.status(404).send("Genre not found");
  }
  res.send(found);
});

//POST
router.post("/", (req, res) => {
  let genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  let validate = validateGenre(genre);
  if (validate.error) {
    return res.status(400).send(validate.error.message);
  }
  genres.push(genre);
  fs.writeFileSync("./data/genres.json", JSON.stringify(data, null, 2));
  res.send(genre);
});

//PUT
router.put("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let found = genres.find((g) => g.id === id);
  if (!found) {
    return res.status(404).send("Genre not found");
  }
  let genre = {
    id: found.id,
    name: req.body.name,
  };
  let validate = validateGenre(genre);
  if (validate.error) {
    return res.status(400).send(validate.error.message);
  }
  let index = genres.indexOf(found);
  genres[index] = genre;
  fs.writeFileSync("./data/genres.json", JSON.stringify(data, null, 2));
  res.send(genre);
});

//DELETE
router.delete("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let found = genres.find((g) => g.id === id);
  if (!found) {
    return res.status(404).send("Genre not found");
  }
  data.genres = genres.filter((g) => g.id !== found.id);
  fs.writeFileSync("./data/genres.json", JSON.stringify(data, null, 2));
  res.send(found);
});

//Validation function
function validateGenre(genre) {
  //Validator rules
  const schema = Joi.object({
    id: Joi.number(),
    name: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(genre);
}

module.exports = router;
