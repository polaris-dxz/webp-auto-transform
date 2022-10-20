import createWebp from "../src/lib/webp/createWebp";
import fs from 'fs-extra'
import removeWebp from "../src/lib/webp/removeWebp";

const entryPath = "./example/images"
const outputPath = "./example/images-webp-test"
const img = `${entryPath}/mail_contact_us.png`
const webp = `${outputPath}/mail_contact_us.webp`

fs.ensureDirSync(outputPath)

const context = {
    options:{
        pluginOptions:{entryPath,outputPath},
        cwebpOptions:[]
    }
}

const contextWithCwebParams = {
    options:{
        pluginOptions:{entryPath,outputPath,quality:75},
        cwebpOptions:[]
    }
}


test("Test webp ", () => {

    fs.removeSync(webp)

    createWebp.call(context,img)

    expect(fs.existsSync(webp)).toBe(true)

    removeWebp.call(context,img)

    expect(fs.existsSync(webp)).toBe(false)

});


test("Test webp defined cwebp params", () => {

    fs.removeSync(webp)

    createWebp.call(contextWithCwebParams,img)

    expect(fs.existsSync(webp)).toBe(true)

    removeWebp.call(contextWithCwebParams,img)

    expect(fs.existsSync(webp)).toBe(false)

});

