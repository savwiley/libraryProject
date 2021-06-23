const path = require("path");


module.exports = {
  entry: "./src/lib.js", 
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist")
  },
  mode: "development",
};