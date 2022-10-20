import { execFileSync } from 'child_process';
import cwebp from 'cwebp-bin';
import { getWebpTransformPath, log } from '../utils';

function createWebp(imgPath) {
  const { cwebpOptions, pluginOptions: { entryPath, outputPath } } = this.options;

  const webpPath = getWebpTransformPath(imgPath, { entryPath, outputPath });

  execFileSync(cwebp, [...cwebpOptions, imgPath, '-o', webpPath]);

  log(`${webpPath} create`);
}

export default createWebp;
