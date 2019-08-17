/**
 * @name Etsy shopping cart
 * @desc Goes to etsy.com, select the first knick knack and adds it to the shopping cart.
 */

const assert = require('assert').strict
const puppeteer = require('puppeteer')
const helpers = require('../test_helpers')
const selectors = require('../selectors/etsy')

let browser
let page

before(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' })
  await page.setViewport({ width: 1280, height: 800 })
})

describe('Etsy shopping cart', () => {
  it('shows the privacy modal', async () => {
    await page.goto('https://www.etsy.com/c/art-and-collectibles/collectibles/figurines?ref=catnav-66', { waitUntil: 'networkidle2' })
    await helpers.acceptGdpr(page, selectors.gdprSingleChoiceAccept)
    assert.ok('Accepted GDPR consent if it existed')
  }).timeout(20000)

  it('selects a product', async () => {
    await helpers.acceptGdpr(page, selectors.gdprSingleChoiceAccept)
    await page.waitForSelector(selectors.listingLink)
    const link = await page.evaluate(sel => {
      const prod = [...document.querySelectorAll(sel)][5]
      return prod.href
    }, selectors.listingLink)
    await page.goto(link, { waitUntil: 'networkidle2' })
    await page.waitForSelector(selectors.buyBtn)
    assert.ok('Add to cart button showing')
  }).timeout(10000)

  it('adds the product to the cart', async () => {
    await helpers.acceptGdpr(page, selectors.gdprSingleChoiceAccept)
    await page.click(selectors.buyBtn)
    await page.waitForSelector(selectors.itemCountH1)
    const quantity = await page.$eval(selectors.itemCountH1, counter => { return counter.textContent.trim() })
    assert(quantity.includes('1 item in your'))
  }).timeout(10000)
})

after(async () => {
  await browser.close()
})
