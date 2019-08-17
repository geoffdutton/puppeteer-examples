
module.exports = {
  /**
   *
   * @param {Page} page
   * @param selector
   * @returns {Promise<void>}
   */
  acceptGdpr: async (page, selector) => {
    // This is hard coded in the base html if you are in a GDPR region like the UK
    const gdpr = await page.$(selector)
    if (gdpr) {
      try {
        await gdpr.click()
      } catch (_) {}
    } else {
      console.warn('No GDPR consent modal found.')
    }
  },
  pageHelpersFactory: page => {
    return {
      async clickXpath (xpath) {
        const [btn] = await page.$x(xpath)
        if (!btn) {
          throw new Error(`No element for for xPath: ${xpath}`)
        }
        await btn.click()
      }
    }
  }
}
