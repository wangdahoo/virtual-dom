import { expect } from 'chai'
import getBrowser from './helpers/browser'

describe('VNode', () => {
  let browser
  let page

  before(function (done) {
    getBrowser()
      .then(_browser => {
        browser = _browser
        return browser.newPage()
      })
      .then(_page => {
        page = _page
      })
      .then(() => done())
  })

  it('create element', async () => {
    await page.goto(`http://127.0.0.1:5000/examples/create-element`)
    await page.waitFor('#root')
    await page.screenshot({
      path: './test/screenshot/create-element.png'
    })

    const innerText = await page.evaluate(sel => {
      return document.querySelector(sel).innerText
    }, '#root')

    expect(innerText).to.be.equal('Hi, Virutal DOM')
  })

  it('node count', async () => {
    await page.goto(`http://127.0.0.1:5000/examples/node-count`)
    await page.waitFor('#root')
    await page.screenshot({
      path: './test/screenshot/node-count.png'
    })

    const assertNodeCount = await page.evaluate(sel => {
      /**
       * Get Total Node Count of Element
       * @param {Element} element
       */
      function getNodeCount (element) {
        let count = 1
        const children = element.childNodes
        for (let i = 0; i < children.length; i++) {
          count += getNodeCount(children[i])
        }
        return count
      }

      return getNodeCount(document.querySelector(sel)) === window.node.getNodeCount()
    }, '#root')

    expect(assertNodeCount).to.be.true // eslint-disable-line
  })
})
