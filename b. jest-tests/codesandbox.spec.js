/**
 * @name codesandbox.io
 * @desc Goes to codesandbox.io, creates a new sandbox and selects the Vue.js template
 */
const puppeteer = require('puppeteer')
const pageHelpersFactory = page => {
  return {
    async clickXpath (xpath) {
      const [btn] = await page.$x(xpath)
      if (!btn) {
        throw new Error(`No element for for xPath: ${xpath}`)
      }
      await btn.click()
    }
  }
}

let browser
let page
let pageHelpers

beforeAll(async () => {
  browser = await puppeteer.launch({ headless: false })
  page = await browser.newPage()
  pageHelpers = pageHelpersFactory(page)
})

describe('codesandbox.io', () => {
  test('creates a Vue.js sandbox', async () => {
    const vueBtn = '//button//div[contains(text(), "Vue")]'
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://codesandbox.io/', { waitUntil: 'networkidle2' })
    await page.waitForSelector('a[href="/s"]')
    await page.click('a[href="/s"]')
    await page.waitForXPath(vueBtn, 5000)
    await pageHelpers.clickXpath(vueBtn)
    await page.waitForSelector('.react-monaco-editor-container')
    const editor = await page.$('.react-monaco-editor-container')
    await page.screenshot({ path: 'codesandbox.png' })
    expect(editor).toBeTruthy()
  }, 30000)
})

afterAll(async () => {
  await browser.close()
})
