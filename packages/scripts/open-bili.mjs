#!/usr/bin/env node
import { chromium } from 'playwright'

async function openBili() {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('https://www.bilibili.com')
  console.log('已打开 B 站')
}

openBili().catch((e) => {
  console.error('打开 B 站失败：', e)
  process.exit(1)
})
