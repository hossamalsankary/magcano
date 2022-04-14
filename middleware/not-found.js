const notFound = (req, res) =>
  res.status(404).json({ massage: "Route does not exist try " });

module.exports = notFound;
