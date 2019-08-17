/**
 * @name Amazon product search
 * @desc Searches Amazon.com for a product and checks if the results show up
 */

const puppeteer = require('puppeteer')

describe('Amazon Homepage', () => {
  let browser
  let page

  const selectors = {
    resultsCol: '[data-component-type="s-search-results"]',
    productTitleBlock: '#titleBlock',
    productLinks: 'a.a-link-normal.a-text-normal',
    nextPage: '[data-component-type="s-pagination"] .a-last'
  }

  beforeAll(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  test('has search input', async () => {
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://www.amazon.com',{ waitUntil: 'networkidle0' })
    const searchInput = await page.$('#twotabsearchtextbox')
    expect(searchInput).toBeTruthy()
  })

  test('shows search results after search input', async () => {
    await page.type('#twotabsearchtextbox', 'nyan cat pullover')
    await page.click('input.nav-input')
    await page.waitForSelector(selectors.resultsCol)
    const firstProduct = await page.$(selectors.productLinks)
    expect(firstProduct).toBeTruthy()
  })
})
