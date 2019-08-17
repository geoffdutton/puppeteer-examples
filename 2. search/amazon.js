/**
 * @name Amazon search
 *
 * @desc Looks for a "nyan cat pullover" on amazon.com, goes two page two clicks the third one.
 */
const puppeteer = require('puppeteer')
const screenshot = 'amazon_nyan_cat_pullover.png'
const selectors = {
  resultsCol: '[data-component-type="s-search-results"]',
  productTitleBlock: '#titleBlock',
  productLinks: 'a.a-link-normal.a-text-normal',
  nextPage: '[data-component-type="s-pagination"] .a-last'
}

;(async () => {
  console.log('\nBegin')
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://www.amazon.com')
  console.log('go to amazon.com')
  await page.type('#twotabsearchtextbox', 'nyan cat pullover')
  await page.click('input.nav-input')
  await page.waitForSelector(selectors.resultsCol)
  await page.screenshot({ path: 'amazon_nyan_cat_pullovers_list.png' })
  await page.click(selectors.nextPage)
  await page.waitFor(selector => document.querySelectorAll(selector).length > 3, {}, selectors.productLinks)
  const pullovers = await page.$$(selectors.productLinks)
  await pullovers[2].click()
  await page.waitForSelector(selectors.productTitleBlock)
  await page.screenshot({path: screenshot})
  await browser.close()
  console.log('See screenshot: ' + screenshot)
})()
  .catch(err => {
    console.error('FATAL', err)
    process.exit(-1)
  })

