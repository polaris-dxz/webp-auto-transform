const chokidar = require("chokidar");
const { isDir } = require("./utils");

const regIsImg = /\.(png|jpg|jpeg|bmp|gif)$/i;

function watchFile(path) {
  chokidar
    .watch(path, {
      ignored: (path) => {
        return !isDir(path) && !regIsImg.test(path);
      },
    })
    .on("add", (path) => {
      console.log(`File ${path} has been added`);
    })
    .on("unlink", (path) => {
      console.log(`File ${path} has been removed`);
    });
}

module.exports = watchFile;