/**
 * @name Google Social Login
 *
 * @desc Logs into Checkly using Google social Login. Provide your username and password as environment variables when running the script, i.e:
 * `GOOGLE_USER=myuser GOOGLE_PWD=mypassword node google_social.js`
 *
 */
const readlineSync = require('readline-sync')
const puppeteer = require('puppeteer');
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

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://app.checklyhq.com/login')

  await page.waitForSelector('div > .social > .text-center > .login-google-button > span')
  await page.click('div > .social > .text-center > .login-google-button > span')

  await page.waitForNavigation()
  await page.waitForSelector('input[type="email"]')
  await page.type('input[type="email"]', gUser)
  await page.click('#identifierNext')

  await page.waitForSelector('input[type="password"]', { visible: true })
  await page.type('input[type="password"]', gPassword)

  await page.waitForSelector('#passwordNext', { visible: true })
  await page.click('#passwordNext')

  await page.waitForNavigation()

  await page.waitFor(5000)

  await browser.close()
})()
  .catch(err => {
    console.error('FATAL', err)
    process.exit(-1)
  })
