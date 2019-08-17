/**
 * @name Staples shopping cart
 * @desc Goes to staples.com and adds a some facepaint to an empty shopping cart. Validates the correct amount.
 */

const assert = require('assert').strict
const puppeteer = require('puppeteer')
const selectors = {
  productTile: '.standard-type__product_tile_hover',
  addToCartBtn: 'div.button__button[title="Add to cart"]'
}
let browser
let page

before(async () => {
  browser = await puppeteer.launch({ headless: true })
  page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3844.0 Safari/537.36')
})

describe('Staples shopping cart', () => {
  it('shows the painting category', async () => {
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://www.staples.com/Painting-Supplies/cat_CL140420/bww15', { waitUntil: 'networkidle2' })
    const category = await page.$eval('h1', txt => txt.textContent.trim())
    assert.equal(category, 'Painting')
  }).timeout(20000)

  it('adds the product to the cart', async () => {
    await page.waitForSelector(selectors.productTile)
    await page.waitForSelector(selectors.addToCartBtn)
    await page.hover(selectors.productTile)
    await page.waitFor(2000)
    await page.click(selectors.addToCartBtn)
    await page.waitForSelector('h4.cart-items-header')
    const quantity = await page.$eval('span.cart-count-msg', txt => txt.textContent.trim())
    assert.equal(quantity, '1')
  }).timeout(12000)
})

after(async () => {
  await browser.close()
})
