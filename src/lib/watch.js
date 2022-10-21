import { isValidImg, log } from './utils';
import chokidar from 'chokidar';
import WebpInit, { CreateWebpEventName, RemoveDirEventName, RemoveWebpEventName } from './webp';

function watchFile(options) {
  const { pluginOptions: { entryPath } } = options;
  const event = WebpInit(options);

  chokidar
    .watch(entryPath)
    .on('add', (path) => {
      if (!isValidImg(path)) {
        return;
      }
      event.emit(CreateWebpEventName, path);
    })
    .on('unlink', (path) => {
      if (!isValidImg(path)) {
        return;
      }
      event.emit(RemoveWebpEventName, path);
    })
    .on('unlinkDir', (path) => {
      event.emit(RemoveDirEventName, path);
    })
    .on('error', (e) => {
      log(`监听发生了错误 ${e.message}`);
    });
}

export default watchFile;
