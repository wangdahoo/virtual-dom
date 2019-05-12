import puppeteer from 'puppeteer'

import fs from 'fs'
import path from 'path'

const SCREENSHOT_DIR = path.join(__dirname, '../screenshot')

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR)
}

export default function (options) {
  return puppeteer.launch(
    Object.assign(
      {
        headless: true
      },
      options || {}
    )
  )
}
