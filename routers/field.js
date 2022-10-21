const { Router } = require("express");
const {
  renderSVG,
  renderJPG,
  savePreview,
  getPreview,
  makePreview,
  getImage,
} = require("../imageworks");
const field = require("../models/").field;

const router = new Router();
// /field

router.get("/all", async (req, res, next) => {
  console.log("FIELDS");
  try {
    const fields = await field.findAll();
    // delete fields.dataValues["data"];
    const fieldsStripped = fields.map((f) => {
      delete f.dataValues["data"];
      return f.dataValues;
    });
    res.send(fieldsStripped);
  } catch (e) {
    next(e);
  }
});

router.get("/intro", async (req, res, next) => {
  const rnd = Math.ceil(Math.random() * 3);
  console.log("INTRO", rnd);
  const image = getImage(rnd);
  const imageTXT = "data:image/jpg;base64," + image.toString("base64");
  // res.setHeader("Content-Type", "image/jpeg");
  res.status(200).send(imageTXT);
});

router.get("/id/:id", async (req, res, next) => {
  console.log("GET FIELD", req.params.id);
  try {
    const fieldId = parseInt(req.params.id);
    const bunkers = await field.findByPk(fieldId);
    // console.log(bunkers);
    res.send({
      data: JSON.parse(bunkers.data),
      name: bunkers.name,
      total: bunkers.total,
      preview: bunkers.preview,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/svg/:id", async (req, res, next) => {
  console.log("GET SVG", req.params.id);
  try {
    const fieldId = parseInt(req.params.id);
    const bunkers = await field.findByPk(fieldId);
    if (bunkers) {
      const svgPic = await renderSVG(JSON.parse(bunkers.data));
      res.setHeader("Content-Type", "image/svg+xml");
      res.status(200).send(svgPic);
    } else {
      res.status(404).send("Field not found");
    }
  } catch (e) {
    next(e);
  }
});

router.get("/jpg/:id", async (req, res, next) => {
  console.log("GET JPG", req.params.id);
  try {
    const fieldId = parseInt(req.params.id);
    const bunkers = await field.findByPk(fieldId);
    if (bunkers) {
      const svgPic = await renderSVG(JSON.parse(bunkers.data));
      const jpgPic = await renderJPG(svgPic);
      res.setHeader("Content-Type", "image/jpeg");
      res.status(200).send(jpgPic);
    } else {
      res.status(404).send("Field not found");
    }
  } catch (e) {
    next(e);
  }
});

router.post("/add", async (req, res, next) => {
  //
  console.log("FIELD ADD");
  try {
    const { data, name, total } = req.body;
    if (!data || !name || !total) {
      console.log("CREATE field - failed - not enough info");
      res.status(400).send("Enter all needed info: data, name");
    } else {
      //create
      const image = await makePreview(data);
      const imageTXT = "data:image/jpg;base64," + image.toString("base64");
      const newField = await field.create({
        data: JSON.stringify(data),
        name,
        total,
        preview: imageTXT,
      });
      console.log("New field created");
      res.send(newField);
      //savePreview(data, newField.id);
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

module.exports = router;
