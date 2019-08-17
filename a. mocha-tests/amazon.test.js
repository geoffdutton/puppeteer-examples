/**
 * @name Amazon product search
 * @desc Searches Amazon.com for a product and checks if the results show up
 */

const assert = require('assert').strict
const puppeteer = require('puppeteer')
const selectors = require('../selectors/amazon')
let browser
let page

before(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
})

describe('Amazon Homepage', () => {
  it('has search input', async () => {
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://www.amazon.com', { waitUntil: 'networkidle0' })
    const searchInput = await page.$('#twotabsearchtextbox')
    assert.ok(searchInput)
    await page.screenshot({ path: 'amz.png' })
  }).timeout(20000)

  it('shows search results after search input', async () => {
    await page.type('#twotabsearchtextbox', 'nyan cat pullover')
    await page.click('input.nav-input')
    await page.waitForSelector(selectors.resultsCol)
    const firstProduct = await page.$(selectors.productLinks)
    assert.ok(firstProduct)
  }).timeout(10000)
})

after(async () => {
  await browser.close()
})
