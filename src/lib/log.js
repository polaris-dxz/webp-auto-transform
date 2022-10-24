import { debounce, humanFileSize } from './utils';

let cache = {};

const log = debounce(()=>{
  const currentImgList = cache;
  cache = {};

  let totalSize = 0;
  let totalWebpSize = 0;

  const imgList = Object.keys(currentImgList);

  imgList.forEach(imgPath=>{
    const item = currentImgList[imgPath];
    const { originSize, webpSize } = item;

    totalSize += parseInt(originSize, 10);
    totalWebpSize += parseInt(webpSize, 10);
  });

  const diffSize = totalSize - totalWebpSize;
  const rate = (diffSize / totalSize).toFixed(2);

  console.table({
    原图片包大小: humanFileSize(totalSize),
    webp图片包大小: humanFileSize(totalWebpSize),
    总共减少体积: humanFileSize(diffSize),
    总共压缩图片数: imgList.length,
    压缩率: `${Number(rate) * 100}%`
  });
}, 1000);

// 输出转换之后的对比
export const logTransformDiff = (imgInfo)=>{
  cache[imgInfo.originPath] = imgInfo;
  log();
};
