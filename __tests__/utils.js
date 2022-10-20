const {
  getCurrentOptions,
  isDir,
  verifyOptions,
  setDefaultPluginOptions,
  getWebpTransformPath
} = require('../src/lib/utils');

const defaultEntry = {
  entryPath: './example/images'
};

const defaultOptions = {
  ...defaultEntry,
  biggerWebpDelete: true,
  customList: [],
  outputPath: './example/images-webp',
  quality: 75,
  webpExistReplace: false
};

const errorList = {
  entryPath: new Error('entryPath 不是一个有效的路径'),
  outputPath: new Error('outputPath 不是一个有效的路径'),
  customList: new Error('customList 必须是一个数组'),
  customItem: new Error('customList 子项不是有效值'),
  quality: new Error('quality 必须是0-100'),
  biggerWebpDelete: new Error('biggerWebpDelete 只能是布尔值'),
  webpExistReplace: new Error('webpExistReplace 只能是布尔值')
};

test('Test isDir', () => {
  expect(isDir()).toBe(false);
  expect(isDir('./aaaa')).toBe(false);
  expect(isDir('./src')).toBe(true);
});

test('Test WebpPath',()=>{

  expect(getWebpTransformPath("./example/images/xxxx.png",{
    entryPath:"./example/images",
    outputPath:"./example/images-webp"
  })).toBe("./example/images-webp/xxxx.webp")
})

test('Test Error Options', () => {
  expect(() => {
    verifyOptions();
  }).toThrow(errorList.entryPath);

  expect(() => {
    verifyOptions({
      entryPath: true
    });
  }).toThrow(errorList.entryPath);

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      outputPath: true
    });
  }).toThrow(errorList.outputErr);

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      customList: true
    });
  }).toThrow(errorList.customList);

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      customList: [true]
    });
  }).toThrow(errorList.customItem);

  expect(() => {
    verifyOptions({
      entryPath: './src',
      quality: true
    });
  }).toThrow(errorList.quality);

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      quality: 101
    });
  }).toThrow(errorList.quality);

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      quality: -1
    });
  }).toThrow(errorList.quality);

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      biggerWebpDelete: 1
    });
  }).toThrow(errorList.biggerWebpDelete);

  expect(() => {
    verifyOptions({
      ...defaultEntry,
      webpExistReplace: 2
    });
  }).toThrow(errorList.webpExistReplace);
});

test('Test Correct Options ', () => {
  expect(
    verifyOptions({
      ...defaultEntry,
      outputPath: './dist',
      customList: [
        {
          path: './src/a',
          quality: 90
        }
      ],
      quality: 10,
      biggerWebpDelete: true,
      webpExistReplace: false
    })
  ).toBe(undefined);
});

test('Test Default Options', () => {
  expect(setDefaultPluginOptions(defaultEntry)).toStrictEqual(defaultOptions);
  expect(
    setDefaultPluginOptions({
      ...defaultEntry,

      customList: [
        {
          path: './a'
        }
      ]
    })
  ).toStrictEqual(defaultOptions);

  expect(
    setDefaultPluginOptions({
      ...defaultEntry,
      customList: [
        {
          path: './a',
          quality: 80
        }
      ]
    })
  ).toStrictEqual({
    ...defaultOptions,
    customList: [
      {
        path: './a',
        quality: 80
      }
    ]
  });

  expect(
    setDefaultPluginOptions({
      ...defaultEntry,
      biggerWebpDelete: false,
      webpExistReplace: true
    })
  ).toStrictEqual({
    ...defaultOptions,
    biggerWebpDelete: false,
    webpExistReplace: true
  });
});

test('Test Options Format', () => {
  expect(() => {
    getCurrentOptions();
  }).toThrow(errorList.entryPath);

  expect(getCurrentOptions(defaultOptions)).toStrictEqual({
    pluginOptions: defaultOptions,
    cwebpOptions: ['-q', 75]
  });

  expect(
    getCurrentOptions({ ...defaultOptions, near_lossless: 79, z: 9 })
  ).toStrictEqual({
    pluginOptions: defaultOptions,
    cwebpOptions: ['-q', 75, '-near_lossless', 79, '-z', 9]
  });
});
