/**
 * @name Etsy shopping cart
 * @desc Goes to etsy.com, select the first knick knack and adds it to the shopping cart.
 */

const puppeteer = require('puppeteer')
const GDPR_SEL = '[data-gdpr-single-choice-accept]'
const PLACEHOLDER_SEL = 'a.listing-link'

describe('Etsy shopping cart', () => {
  let browser
  let page

  /**
   *
   * @param {Page} page
   * @returns {Promise<void>}
   */
  const acceptGdpr = async page => {
    // This is hard coded in the base html if you are in a GDPR region like the UK
    const gdpr = await page.$(GDPR_SEL)
    if (gdpr) {
      try {
        await gdpr.click()
      } catch (_) {}
    } else {
      console.warn('No GDPR consent modal found.')
    }
  }

  const waitForSelectorTimeout = (page, sel) => page.waitForSelector(sel, { timeout: 3000 })

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false })
    /**
     *
     * @type {Page}
     */
    page = await browser.newPage()
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' })
    await page.setViewport({ width: 1280, height: 800 })
  })

  afterAll(async () => {
    await browser.close()
  })

  test('shows the privacy modal', async () => {
    await page.goto('https://www.etsy.com/c/art-and-collectibles/collectibles/figurines?ref=catnav-66', { waitUntil: 'networkidle2' })
    await acceptGdpr(page)
  }, 20000)

  test('selects a product', async () => {
    await acceptGdpr(page)
    await waitForSelectorTimeout(page, PLACEHOLDER_SEL)
    const link = await page.evaluate(sel => {
      const prod = [...document.querySelectorAll(sel)][5]
      return prod.href
    }, PLACEHOLDER_SEL)
    await page.goto(link, { waitUntil: 'networkidle2' })
    await waitForSelectorTimeout(page, 'button.btn-buy-box')
    expect.anything('Add to cart button showing')
  }, 10000)

  test('adds the product to the cart', async () => {
    await acceptGdpr(page)
    await page.click('button.btn-buy-box')
    await waitForSelectorTimeout(page, 'h1.item-count')
    const quantity = await page.$eval('h1.item-count', counter => { return counter.textContent.trim() })
    expect(quantity).toContain('1 item in your ')
  }, 10000)
})
