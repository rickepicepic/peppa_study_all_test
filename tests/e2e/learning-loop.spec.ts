import { expect, test } from '@playwright/test';

test('guest can finish reading quiz and continue', async ({ page }) => {
  await page.goto('/network/system/tcp-handshake');

  await page.getByRole('button', { name: '开始测验' }).click();
  await page.locator('[data-quiz-id="tcp-handshake-01"] input[type="radio"][value="B"]').first().check();
  await page.getByRole('button', { name: '提交' }).click();

  await expect(page.getByRole('heading', { name: '解析' })).toBeVisible();

  await page.getByRole('link', { name: '继续下一节' }).click();
  await expect(page).toHaveURL(/\/network\/system\//);
});