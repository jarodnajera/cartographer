import { test, expect } from '@playwright/test'
test('sample ledger navigates, corrects a task and retains child reminders on completed projects', async ({ page }) => {
  await page.goto('/today')
  await page.getByRole('button', { name: 'Explore sample workspace' }).click()
  await expect(page.getByRole('heading', { name: 'Today', exact: true })).toBeVisible()
  await expect(page.getByText('Sample workspace.', { exact: true })).toBeVisible()
  if ((page.viewportSize()?.width || 1280) <= 760) { await page.getByRole('button', {name:'Menu',exact:true}).click();await expect(page.getByRole('button',{name:'Leave sample',exact:true}).last()).toBeVisible();await page.getByRole('button',{name:'Menu',exact:true}).click() }
  await page.getByRole('button', { name: 'Complete task', exact: true }).first().click()
  await expect(page.getByRole('status').filter({ hasText: 'Changes saved.' })).toBeVisible()
  await page.getByRole('link', { name: 'INV-019', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Editorial identity', exact: true })).toBeVisible()
  await expect(page.getByText('Project-deadline reminders have stopped.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Add task', exact: true }).click()
  await page.getByLabel('Task title').fill('Confirm the handoff')
  await page.getByRole('dialog').getByRole('button', { name: 'Add task', exact: true }).click()
  await expect(page.getByText('Confirm the handoff', { exact: true })).toBeVisible()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow).toBe(false)
})
