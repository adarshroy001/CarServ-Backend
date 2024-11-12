const getStaticFilePath = (req, fileName) => {
  return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};

const getLocalPath = (fileName) => {
  return `public/images/${fileName}`;
};

module.exports = { getStaticFilePath, getLocalPath };
