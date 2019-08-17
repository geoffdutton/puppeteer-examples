/**
 * @name codesandbox.io
 * @desc Goes to codesandbox.io, creates a new sandbox and selects the Vue.js template
 */

const assert = require('assert').strict
const puppeteer = require('puppeteer')
const helpers = require('../test_helpers')
const selectors = require('../selectors/codesandbox.io')

let browser
let page
let pageHelpers

before(async () => {
  browser = await puppeteer.launch({ headless: true })
  page = await browser.newPage()
  pageHelpers = helpers.pageHelpersFactory(page)
})

describe('codesandbox.io', () => {
  it('creates a vanilla.js sandbox', async () => {
    const vueBtn = selectors.vueBtnXpath
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://codesandbox.io/', { waitUntil: 'networkidle2' })
    await page.waitForSelector(selectors.startingAnchor)
    await page.click(selectors.startingAnchor)
    await page.waitForXPath(vueBtn, 5000)
    await pageHelpers.clickXpath(vueBtn)
    await page.waitForSelector(selectors.reactEditorContainer)
    const editor = await page.$(selectors.reactEditorContainer)
    assert.ok(editor)
  }).timeout(30000)
})

after(async () => {
  await browser.close()
})
