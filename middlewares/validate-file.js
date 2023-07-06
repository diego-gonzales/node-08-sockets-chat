const validateFile = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.myFile) {
    return res.status(400).json({
      ok: false,
      msg: 'No files were uploaded - validatefile middleware',
    });
  }

  next();
};

module.exports = {
  validateFile,
};
