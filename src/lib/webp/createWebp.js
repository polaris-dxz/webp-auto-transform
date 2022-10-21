import { execFileSync } from 'child_process';
import cwebp from 'cwebp-bin';
import { pathExistsSync, removeSync, statSync } from 'fs-extra';
import { basename } from 'path';
import {
  getCwebpOptions,
  getImgCustomCwebpConfig,
  getWebpTransformPath,
  log
} from '../utils';

function createWebp(imgPath) {
  const { cwebpOptions, pluginOptions } = this.options;

  const {
    entryPath,
    outputPath,
    biggerWebpDelete,
    webpExistReplace,
    customList
  } = pluginOptions;

  const webpPath = getWebpTransformPath(imgPath, { entryPath, outputPath });
  const customCwebpConfig = getImgCustomCwebpConfig(imgPath, customList);

  const currentCwebpOptions = getCwebpOptions({
    ...cwebpOptions,
    ...customCwebpConfig
  });

  // 已经存在webp，但是设置不替换
  if (
    pathExistsSync(webpPath)
    && !webpExistReplace
  ) {
    return;
  }

  try {
    execFileSync(cwebp, [...currentCwebpOptions, imgPath, '-o', webpPath]);
  } catch (error) {
    log(`${imgPath} 转换 webp 失败, 检查配置是否出错->`, cwebpOptions);
  }

  const statsOrigin = statSync(imgPath);
  const statsWebp = statSync(webpPath);

  // 如果原图更小，那么直接使用原图
  if (statsOrigin.size < statsWebp.size && biggerWebpDelete) {
    removeSync(webpPath);
    log(
      '删除更大的webp-->',
      webpPath,
      (statsWebp.size - statsOrigin.size) / 1024
    );
  }

  log(`${basename(webpPath)} create`);
}

export default createWebp;
