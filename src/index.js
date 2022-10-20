import { getCurrentOptions } from './lib/utils';
import watchFile from './lib/watch';

function WebpAutoTransform(options) {
  const currentOptions = getCurrentOptions(options);

  watchFile();
}

export default WebpAutoTransform;
