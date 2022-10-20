import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const originLog = console.log;
console.log = function (...args) {
  originLog.apply(console, [
    chalk.blue("[webp-auto-transform log]: "),
    ...args,
  ]);
};

export function isDir(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (error) {
    return false;
  }
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
    webpExistReplace,
  } = options;

  if (!isDir(entryPath)) {
    throw new Error("entryPath 不是一个有效的路径");
  }

  if (outputPath && typeof outputPath !== "string") {
    throw new Error("outputPath 不是一个有效的路径");
  }

  if (customList && !Array.isArray(customList)) {
    throw new Error("customList 必须是一个数组");
  }

  if (Array.isArray(customList)) {
    customList.forEach((item) => {
      if (typeof item !== "object") {
        throw new Error("customList 子项不是有效值");
      }
    });
  }

  if (
    (quality && typeof quality !== "number") ||
    (typeof quality === "number" && (quality > 100 || quality < 0))
  ) {
    throw new Error("quality 必须是0-100");
  }

  if (biggerWebpDelete && typeof biggerWebpDelete !== "boolean") {
    throw new Error("biggerWebpDelete 只能是布尔值");
  }

  if (webpExistReplace && typeof webpExistReplace !== "boolean") {
    throw new Error("webpExistReplace 只能是布尔值");
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
  } = options;

  const currentCustomList = customList.filter((item) => {
    const { quality: q, path } = item;
    if (!path || q === quality) return false;

    return true;
  });

  return {
    entryPath,
    outputPath: outputPath || getDefaultOutputPath(entryPath),
    customList: currentCustomList,
    quality: quality || 75,
    biggerWebpDelete: biggerWebpDelete ?? true,
    webpExistReplace: webpExistReplace ?? false,
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
    ...rest
  } = options;

  // 本工具用的参数
  const pluginOptions = setDefaultPluginOptions({
    entryPath,
    outputPath,
    quality,
    customList,
    biggerWebpDelete,
    webpExistReplace,
  });

  const webpParamas = {
    q: quality,
    ...rest,
  };
  const cwebpOptions = []; // cwebp 用的参数

  for (let opt in webpParamas) {
    const currentVal = webpParamas[opt];

    // 忽略参数 o，输出path 已经在配置决定
    if (opt === "o") {
      continue;
    }

    // 值为 false 忽略
    if (currentVal === false || currentVal === "false") {
      continue;
    }

    // 选项
    cwebpOptions.push("-" + opt);

    // 值不是 true，压入选项的值
    if (currentVal && currentVal !== true && currentVal !== "true") {
      cwebpOptions.push(currentVal);
    }
  }

  return {
    cwebpOptions,
    pluginOptions,
  };
}
