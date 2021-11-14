const { merge } = require("webpack-merge");
const commonConfiguration = require("./webpack.common.js");
const path = require("path");

module.exports = merge(commonConfiguration, {
  mode: "development",
  devServer: {
    host: "local-ip",
    port: 3000,
    allowedHosts: "all",
    static: {
      watch: true,
      directory: path.join(__dirname, "../static"),
    },
  },
});
