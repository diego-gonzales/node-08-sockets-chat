const path = require('path');
const { VALID_EXTENSIONS } = require('../consts');

const uploadMyFile = (
  files,
  validExtensions = VALID_EXTENSIONS,
  folder = ''
) => {
  return new Promise((resolve, reject) => {
    const { myFile } = files;

    const splitFileName = myFile.name.split('.');
    const fileExtension = splitFileName[splitFileName.length - 1];

    if (!validExtensions.includes(fileExtension))
      return reject(`File with '${fileExtension}' extension is not allowed`);

    const newFileName = `${
      splitFileName[0]
    }-${new Date().getTime()}.${fileExtension}`;

    const uploadPath = path.join(__dirname, '../uploads/', folder, newFileName);

    // mv is a method from the myFile object (Thanks to the express-fileupload package)
    myFile.mv(uploadPath, (err) => {
      if (err) reject(err);
      resolve(newFileName);
    });
  });
};

module.exports = {
  uploadMyFile,
};
