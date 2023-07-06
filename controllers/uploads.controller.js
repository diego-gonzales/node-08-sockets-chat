const fs = require('fs');
const path = require('path');
const { request, response } = require('express');
const { uploadMyFile } = require('../helpers/upload-file');
const { COLLECTIONS } = require('../consts');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFile = async (req = request, res = response) => {
  try {
    const fileName = await uploadMyFile(req.files, undefined, 'images');
    res.json({ fileName });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const updateCollectionImage = async (req = request, res = response) => {
  const { collection, id } = req.params;

  const model = await searchAndValidateCollection({
    collectionName: collection,
    collectionID: id,
    res,
  });

  // 🧹🧹🧹 Clean previous images
  if (model.imageURL) {
    const imagePath = path.join(
      __dirname,
      '../uploads',
      collection,
      model.imageURL
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  const fileName = await uploadMyFile(req.files, undefined, collection);
  model.imageURL = fileName;
  await model.save();

  return res.json(model);
};

const updateCollectionImageCloudinary = async (
  req = request,
  res = response
) => {
  const { collection, id } = req.params;

  const model = await searchAndValidateCollection({
    collectionName: collection,
    collectionID: id,
    res,
  });

  // 🧹🧹🧹 Clean previous images in Cloudinary
  if (model.imageURL) {
    const cloudinaryImageID = model.imageURL.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(cloudinaryImageID);
  }

  const { tempFilePath } = req.files.myFile;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  model.imageURL = secure_url;
  await model.save();

  return res.json(model);
};

const getCollectionImage = async (req = request, res = response) => {
  const { collection, id } = req.params;

  const model = await searchAndValidateCollection({
    collectionName: collection,
    collectionID: id,
    res,
  });

  // 👀👀👀 Verify if the model has an image and if it exists in the server, then send it
  if (model.imageURL) {
    const imagePath = path.join(
      __dirname,
      '../uploads',
      collection,
      model.imageURL
    );

    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
  }

  const imagePath = path.join(__dirname, '../assets/no-image.jpg');
  return res.sendFile(imagePath);
};

const searchAndValidateCollection = async ({
  collectionName,
  collectionID,
  res,
}) => {
  const model = await COLLECTIONS[collectionName].findById(collectionID);

  if (!model) {
    return res.status(400).json({
      ok: false,
      msg: `There is no ${collectionName} with the id ${collectionID}`,
    });
  }

  return model;
};

module.exports = {
  uploadFile,
  updateCollectionImage,
  updateCollectionImageCloudinary,
  getCollectionImage,
};
