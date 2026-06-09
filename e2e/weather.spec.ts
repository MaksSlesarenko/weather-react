import { test, expect, type Page } from '@playwright/test'

async function searchCity(page: Page, city: string) {
  const input = page.getByPlaceholder('Search city...')
  await input.click()
  await input.pressSequentially(city, { delay: 50 })
  await page.getByRole('listbox').waitFor({ timeout: 5000 })
  // Match 'London, GB' but not 'Londonderry' — letter after city name must be non-alpha
  await page.getByRole('option', { name: new RegExp(`^${city}[^a-zA-Z]`, 'i') }).first().click()
}

test.describe('Weather Forecast App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows prompt on load', async ({ page }) => {
    await expect(page.getByText(/search for a city/i)).toBeVisible()
  })

  test('searches for a city and shows weather card', async ({ page }) => {
    await searchCity(page, 'London')

    await expect(page.getByText(/°C/)).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/m\/s/i)).toBeVisible()
    await expect(page.getByRole('heading', { name: /London/i })).toBeVisible()
  })

  test('city appears in history after search', async ({ page }) => {
    await searchCity(page, 'Paris')

    await expect(page.getByText(/°C/)).toBeVisible({ timeout: 5000 })
    // History renders city name lowercase as primary text
    await expect(page.getByText('paris', { exact: true })).toBeVisible()
  })

  test('clicking history item re-fetches weather', async ({ page }) => {
    await searchCity(page, 'Tokyo')
    await expect(page.getByText(/°C/)).toBeVisible({ timeout: 5000 })

    await searchCity(page, 'Berlin')
    await expect(page.getByRole('heading', { name: /Berlin/i })).toBeVisible({ timeout: 5000 })

    await page.getByText('tokyo', { exact: true }).click()
    await expect(page.getByRole('heading', { name: /Tokyo/i })).toBeVisible({ timeout: 5000 })
  })

  test('removes city from history', async ({ page }) => {
    await searchCity(page, 'Madrid')
    await expect(page.getByText(/°C/)).toBeVisible({ timeout: 5000 })

    await page.getByLabel(/remove madrid/i).click()
    await expect(page.getByText('madrid', { exact: true })).not.toBeVisible()
    await expect(page.getByText(/city removed/i)).toBeVisible()
  })

  test('undo restores deleted history item', async ({ page }) => {
    await searchCity(page, 'Rome')
    await expect(page.getByText(/°C/)).toBeVisible({ timeout: 5000 })

    await page.getByLabel(/remove rome/i).click()
    await page.getByRole('button', { name: 'Undo' }).first().click()

    await expect(page.getByText('rome', { exact: true })).toBeVisible()
  })

  test('theme toggle switches between dark and light', async ({ page }) => {
    const body = page.locator('body')
    // #1C1C1E dark, #F5F5F7 light
    await expect(body).toHaveCSS('background-color', 'rgb(28, 28, 30)')

    await page.getByRole('button', { name: /switch to light mode/i }).click()
    await expect(body).toHaveCSS('background-color', 'rgb(245, 245, 247)')

    await page.getByRole('button', { name: /switch to dark mode/i }).click()
    await expect(body).toHaveCSS('background-color', 'rgb(28, 28, 30)')
  })
})
