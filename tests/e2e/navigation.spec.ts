import { expect, test } from '@playwright/test';

test('can switch between system and interview tracks', async ({ page }) => {
  await page.goto('/');
  await page.locator('a[href="/network/system/"]', { hasText: '体系化主线' }).first().click();
  await expect(page).toHaveURL(/\/network\/system\//);

  await page.locator('a[href="/network/interview/"]', { hasText: '面试速查' }).first().click();
  await expect(page).toHaveURL(/\/network\/interview\//);
});
