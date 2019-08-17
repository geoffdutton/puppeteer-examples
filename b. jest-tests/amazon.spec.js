/**
 * @name Amazon product search
 * @desc Searches Amazon.com for a product and checks if the results show up
 */

const puppeteer = require('puppeteer')

describe('Amazon Homepage', () => {
  let browser
  let page

  const selectors = require('../selectors/amazon')

  beforeAll(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  test('has search input', async () => {
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://www.amazon.com', { waitUntil: 'networkidle0' })
    const searchInput = await page.$(selectors.searchBox)
    expect(searchInput).toBeTruthy()
  }, 10000)

  test('shows search results after search input', async () => {
    await page.type(selectors.searchBox, 'nyan cat pullover')
    await page.click(selectors.searchBtn)
    await page.waitForSelector(selectors.resultsCol)
    const firstProduct = await page.$(selectors.productLinks)
    expect(firstProduct).toBeTruthy()
  })
})
