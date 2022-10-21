import { removeSync } from 'fs-extra';
import { getOutputPathByEntry, log } from '../utils';

function removeDir(dirPath) {
  const { pluginOptions: { entryPath, outputPath } } = this.options;

  const webpDirPath = getOutputPathByEntry(dirPath, { entryPath, outputPath });

  removeSync(webpDirPath);

  log(`${dirPath} remove`);
}

export default removeDir;
