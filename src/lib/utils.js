import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export function log(...args) {
  console.log(
    chalk.blue('[webp-auto-transform log]: '),
    ...args
  );
}

export function isDir(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

export function getWebpTransformPath(originImgPath, { entryPath, outputPath }) {
  const extname = path.extname(originImgPath);
  const resultPath = originImgPath.replace(entryPath, outputPath).replace(new RegExp(`\\${extname}$`), '.webp');
  const dirPath = path.dirname(resultPath);

  fs.ensureDirSync(dirPath); // 确保路径存在

  return resultPath;
}

export function getDefaultOutputPath(entryPath) {
  const lastDir = path.basename(entryPath);

  const webpDir = `${lastDir}-webp`;
  return entryPath.replace(lastDir, webpDir);
}

export function verifyOptions(options = {}) {
  const {
    entryPath,
    outputPath,
    quality,
    customList,
    biggerWebpDelete,
    webpExistReplace
  } = options;

  if (!isDir(entryPath)) {
    throw new Error('entryPath 不是一个有效的路径');
  }

  if (outputPath && typeof outputPath !== 'string') {
    throw new Error('outputPath 不是一个有效的路径');
  }

  if (customList && !Array.isArray(customList)) {
    throw new Error('customList 必须是一个数组');
  }

  if (Array.isArray(customList)) {
    customList.forEach((item) => {
      if (typeof item !== 'object') {
        throw new Error('customList 子项不是有效值');
      }
    });
  }

  if (
    (quality && typeof quality !== 'number')
    || (typeof quality === 'number' && (quality > 100 || quality < 0))
  ) {
    throw new Error('quality 必须是0-100');
  }

  if (biggerWebpDelete && typeof biggerWebpDelete !== 'boolean') {
    throw new Error('biggerWebpDelete 只能是布尔值');
  }

  if (webpExistReplace && typeof webpExistReplace !== 'boolean') {
    throw new Error('webpExistReplace 只能是布尔值');
  }
}

export function setDefaultPluginOptions(options = {}) {
  const {
    entryPath,
    outputPath,
    quality,
    customList = [],
    biggerWebpDelete,
    webpExistReplace,
    quiet,
    ...rest
  } = options;

  const currentCustomList = customList.filter((item) => {
    const { quality: q, path: itemPath } = item;
    if (!itemPath || q === quality) return false;

    return true;
  });

  return {
    entryPath,
    outputPath: outputPath ?? getDefaultOutputPath(entryPath),
    customList: currentCustomList,
    quality: quality ?? 75,
    biggerWebpDelete: biggerWebpDelete ?? true,
    webpExistReplace: webpExistReplace ?? false,
    quiet: quiet ?? true,
    ...rest
  };
}

export function getCurrentOptions(options = {}) {
  verifyOptions(options);

  const {
    entryPath,
    outputPath,
    quality,
    customList,
    biggerWebpDelete,
    webpExistReplace,
    quiet,
    ...rest
  } = setDefaultPluginOptions(options);

  // 本工具用的参数
  const pluginOptions = {
    entryPath,
    outputPath,
    quality,
    customList,
    biggerWebpDelete,
    webpExistReplace
  };

  const webpParamas = {
    q: quality,
    quiet: quiet,
    ...rest
  };
  const cwebpOptions = []; // cwebp 用的参数

  const list = Object.keys(webpParamas);

  for (let index = 0; index < list.length; index += 1) {
    const key = list[index];
    const currentVal = webpParamas[key];

    // 忽略参数 o，输出path 已经在配置决定
    if (key === 'o') {
      continue;
    }

    // 值为 false 忽略
    if (currentVal === false || currentVal === 'false') {
      continue;
    }

    // 选项
    cwebpOptions.push('-' + key);

    // 值不是 true，压入选项的值
    if (currentVal && currentVal !== true && currentVal !== 'true') {
      cwebpOptions.push(currentVal);
    }
  }

  return {
    cwebpOptions,
    pluginOptions
  };
}
