import { isDir, log } from './utils';
import chokidar from 'chokidar';
import WebpInit, { CreateWebpEventName, RemoveWebpEventName } from './webp';

const regIsImg = /\.(png|jpg|jpeg|bmp|gif)$/i;

function watchFile(options) {
  const { pluginOptions: { entryPath } } = options;
  const event = WebpInit(options);

  chokidar
    .watch(entryPath, {
      ignored: (path) => {
        return !isDir(path) && !regIsImg.test(path);
      }
    })
    .on('add', (path) => {
      event.emit(CreateWebpEventName, path);
      log(`${path} added`);
    })
    .on('unlink', (path) => {
      event.emit(RemoveWebpEventName, path);
      log(` ${path} removed`);
    })
    .on('error', (e) => {
      log(`监听错误 ${e.message}`);
    });
}

export default watchFile;
