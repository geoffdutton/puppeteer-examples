/**
 * @name Alibaba product search
 * @desc Searches Alibaba.com for a product and checks if the results show up
 */

const puppeteer = require('puppeteer')

describe('Alibaba Search', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  test('has search input', async () => {
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://www.alibaba.com', { waitUntil: 'networkidle0' })
    const searchInput = await page.$('input.ui-searchbar-keyword')
    expect(searchInput).toBeTruthy()
  }, 10000)

  test('shows search results after search input', async () => {
    await page.type('input.ui-searchbar-keyword', 'lucky cat')
    await page.click('input.ui-searchbar-submit')
    await page.waitForSelector('[data-content="abox-ProductNormalList"]')
    const firstProduct = await page.$('.item-content')
    expect(firstProduct).toBeTruthy()
  })
})
