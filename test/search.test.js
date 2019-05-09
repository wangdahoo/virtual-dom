const { expect } = require('chai')
const { test } = require('./utils/browser')

describe('Search', () => {
  it(
    'search "王大虎"',
    test(async (browser, opts) => {
      const page = await browser.newPage()
      await page.goto(`https://www.baidu.com`)
      await page.type('#kw', '王大虎', { delay: 100 })
      await page.click('#su')
      await page.waitFor('#container > div.head_nums_cont_outer.OP_LOG > div > div.nums > span')
      await page.screenshot({
        path: './test/screenshot.png'
      })

      const innerText = await page.evaluate(sel => {
        return document.querySelector(sel).innerText
      }, '#container > div.head_nums_cont_outer.OP_LOG > div > div.nums > span')

      expect(innerText).to.be.matches(/百度为您找到相关结果约[\d,]+个/)
    })
  )
})
