/**
 * @name codesandbox.io
 * @desc Goes to codesandbox.io, creates a new sandbox and selects the Vue.js template
 */
const puppeteer = require('puppeteer')
const helpers = require('../test_helpers')
const selectors = require('../selectors/codesandbox.io')

describe('codesandbox.io', () => {
  let browser
  let page
  let pageHelpers

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true })
    page = await browser.newPage()
    pageHelpers = helpers.pageHelpersFactory(page)
  })

  afterAll(async () => {
    await browser.close()
  })

  test('creates a Vue.js sandbox', async () => {
    const vueBtn = selectors.vueBtnXpath
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://codesandbox.io/', { waitUntil: 'networkidle2' })
    await page.waitForSelector(selectors.startingAnchor)
    await page.click(selectors.startingAnchor)
    await page.waitForXPath(vueBtn, 5000)
    await pageHelpers.clickXpath(vueBtn)
    await page.waitForSelector(selectors.reactEditorContainer)
    const editor = await page.$(selectors.reactEditorContainer)
    await page.screenshot({ path: 'codesandbox.png' })
    expect(editor).toBeTruthy()
  }, 30000)
})
