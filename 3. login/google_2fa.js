/**
 * @name Google Login with 2FA
 *
 * @desc Logs into a Google Account. Provide your username and password as environment variables when running the script, i.e:
 * `GOOGLE_USER=myuser GOOGLE_PWD=mypassword node google_2fa.js`
 *
 */
const path = require('path')
const readlineSync = require('readline-sync')
const puppeteer = require('puppeteer')
let browser;
(async () => {
  let gUser = process.env.GOOGLE_USER
  let gPassword = process.env.GOOGLE_PWD

  if (!gUser) {
    gUser = readlineSync.question('Google Email: ')
  }

  if (!gPassword) {
    gPassword = readlineSync.question('Google Password: ', {
      hideEchoBack: true
    })
  }

  browser = await puppeteer.launch({
    headless: true,
    userDataDir: path.resolve(__dirname, '.user_data')
  })
  const page = await browser.newPage()

  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://myaccount.google.com', { waitUntil: 'networkidle0' })

  const firstUrl = await page.url()

  if (!firstUrl.includes('myaccount.google.com/intro')) {
    console.log('all ready logged in')
    return
  }

  const loginBtn = 'a[href*="ServiceLogin"]'

  await page.waitForSelector(loginBtn)
  await page.click(loginBtn)

  await page.waitForNavigation()
  await page.waitForSelector('input[type="email"]')
  await page.type('input[type="email"]', gUser)
  await page.click('#identifierNext')

  await page.waitForSelector('input[type="password"]', { visible: true })
  await page.type('input[type="password"]', gPassword)

  await page.waitForSelector('#passwordNext', { visible: true })
  await page.click('#passwordNext')

  await page.waitForNavigation()

  const url = await page.url()

  if (url.includes('/challenge')) {
    console.log('Need to confirm in the Gmail App')
    await page.waitForNavigation()
  }

  const finalUrl = await page.url()

  console.log('final url', finalUrl)
})()
  .then(() => browser.close())
  .catch(err => {
    console.error('FATAL', err)
    process.exit(-1)
  })
