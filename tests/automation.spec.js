// Amazon Website Test Cases using Playwright
// These tests cover common e-commerce functionality

const { test, expect } = require('@playwright/test');

/**
 * Test Case 1: Basic Homepage Loading
 * This checks if the website loads correctly
 */
test('Homepage should load successfully', async ({ page }) => {
  // Visit the homepage
  // Add this to your test before the page.goto line
console.log('Using URL:', process.env.APP_URL || 'http://localhost:3000');
await page.goto(process.env.APP_URL || 'http://localhost:3000', {
  ignoreHTTPSErrors: true,
  timeout: 60000

});
  
  // Check if the Amazon logo is visible
  await expect(page.locator('#site-logo')).toBeVisible();

  
  // Check if the search box is available
 
});

