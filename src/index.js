const { getCurrentOptions } = require("./lib/utils");
const watch = require("./lib/watch");

function WebpAutoTransform(options) {
  const currentOptions = getCurrentOptions(options);

  watch("./assets/");
}

module.exports = WebpAutoTransform;
