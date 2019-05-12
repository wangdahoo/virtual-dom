import { expect } from 'chai'
import puppeteer from 'puppeteer'

const getBrowser = options =>
  puppeteer.launch(
    Object.assign(
      {
        headless: true
      },
      options
    )
  )

let browser

after(() => {
  if (browser) browser.close()
})

describe('VNode', () => {
  it('create-element', async () => {
    browser = await getBrowser()
    const page = await browser.newPage()
    await page.goto(`http://127.0.0.1:5000/examples/create-element`)
    await page.waitFor('#root')
    await page.screenshot({
      path: './test/screenshot.png'
    })

    const innerText = await page.evaluate(sel => {
      return document.querySelector(sel).innerText
    }, '#root')

    expect(innerText).to.be.equal('Hi, Virutal DOM')
  })
})
