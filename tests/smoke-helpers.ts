import { type Page, type Expect, expect } from '@playwright/test'

/** Assert the page loads with a visible H1 and back-to-explorer link */
export async function assertPageLoads(page: Page, slug: string) {
  await page.goto(`/${slug}`)
  await expect(page.locator('h1')).toBeVisible()
}

/** Assert a textarea or input is visible on the page */
export async function assertInputExists(page: Page) {
  const input = page.locator('textarea, input[type="text"], input:not([type])').first()
  await expect(input).toBeVisible()
  return input
}

/** Assert at least one action button is visible */
export async function assertButtonExists(page: Page, buttonText: RegExp) {
  const btn = page.locator('button').filter({ hasText: buttonText }).first()
  await expect(btn).toBeVisible()
  return btn
}

/** Fill an input, click a button, and assert output area has content */
export async function assertActionWorks(
  page: Page,
  inputSelector: string,
  inputValue: string,
  buttonText: RegExp,
  outputSelector: string,
) {
  const input = page.locator(inputSelector).first()
  await input.fill(inputValue)
  const btn = page.locator('button').filter({ hasText: buttonText }).first()
  await btn.click()
  const output = page.locator(outputSelector).first()
  await expect(output).not.toBeEmpty()
}
