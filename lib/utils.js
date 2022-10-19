const fs = require("fs-extra");

/**
 * 判断是否是目录
 * @param  {Object} path 目录路径
 * @return {Boolean}
 */
function isDir(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * 获取默认的输出目录
 * @param  {String} path 入口目录路径
 * @return {String}
 */
function getOutputPath(entryPath) {}

/**
 * 设置工具默认的参数
 * @param  {String} path 入口目录路径
 * @return {String}
 */
function setDefaultPluginOptions(options) {
  const {
    entryPath,
    outputPath,
    quality,
    customList,
    biggerWebpDelete,
    webpExistReplace,
  } = options;
}

/**
 * 获取额外的 webp 配置
 * @param  {Object} opts key 为配置项，value 为配置参数值
 * @return {Array}
 */
function getCurrentOptions(options) {
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

module.exports = {
  isDir,
  getCurrentOptions,
};
