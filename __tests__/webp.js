import createWebp from "../src/lib/webp/createWebp";
import fs from "fs-extra";
import removeWebp from "../src/lib/webp/removeWebp";
import path from "path";
import { getAbsolutePath } from "../src/lib/utils";

const entryPath = "./example/images";
const outputPath = "./example/images-webp-test";

const currentCwd = process.cwd();

const entryAbPath = path.resolve(currentCwd, entryPath);
const outputAbPath = path.resolve(currentCwd, outputPath);

const img = path.resolve(entryAbPath, "mail_contact_us.png");
const webp = path.resolve(outputAbPath, "mail_contact_us.webp");

console.log("img",img);
console.log("webp",webp);

fs.ensureDirSync(outputAbPath);

const context = {
  options: {
    // 这里是方法单元测试，不能传入相对路径，因为没有经过里面的方法处理，处理之后是绝对路径
    pluginOptions: { entryPath: getAbsolutePath(entryPath), outputPath: getAbsolutePath(outputPath) },
    cwebpOptions: {},
  },
};

const contextWithCwebParams = {
  options: {
    pluginOptions: {
      entryPath: getAbsolutePath(entryPath),
      outputPath: getAbsolutePath(outputPath),
      quality: 75,
    },
    cwebpOptions: {},
  },
};

test("Test webp ", () => {
  fs.removeSync(webp);

  createWebp.call(context, img);

  expect(fs.existsSync(webp)).toBe(true);

  removeWebp.call(context, img);

  expect(fs.existsSync(webp)).toBe(false);
});

test("Test webp defined cwebp params", () => {
  fs.removeSync(webp);

  createWebp.call(contextWithCwebParams, img);

  expect(fs.existsSync(webp)).toBe(true);

  removeWebp.call(contextWithCwebParams, img);

  expect(fs.existsSync(webp)).toBe(false);
});
