// Amazon Website Test Cases using Playwright
// These tests cover common e-commerce functionality

const { test, expect } = require('@playwright/test');

/**
 * Test Case 1: Basic Homepage Loading
 * This checks if the website loads correctly
 */
test('Homepage should load successfully', async ({ page }) => {
  // Visit the homepage
  await page.goto('https://www.amazon.com');
  
  // Check if the Amazon logo is visible
  await expect(page.locator('id=nav-logo')).toBeVisible();
  
  // Check if the search box is available
  await expect(page.locator('id=twotabsearchtextbox')).toBeVisible();
});

/**
 * Test Case 2: Search Functionality
 * This tests if we can search for products
 */
test('Search for a product', async ({ page }) => {
  await page.goto('https://www.amazon.com');
  
  // Type "laptop" in the search box
  await page.fill('id=twotabsearchtextbox', 'laptop');
  
  // Click the search button
  await page.click('id=nav-search-submit-button');
  
  // Check if search results appear
  await expect(page.locator('.s-result-item')).toBeVisible();
  
  // Check if search results contain the word "laptop"
  const searchResults = await page.locator('.s-result-item h2').first().textContent();
  expect(searchResults.toLowerCase()).toContain('laptop');
});

/**
 * Test Case 3: Product Details Page
 * This verifies if clicking on a product shows its details
 */
test('View product details', async ({ page }) => {
  await page.goto('https://www.amazon.com');
  await page.fill('id=twotabsearchtextbox', 'headphones');
  await page.click('id=nav-search-submit-button');
  
  // Click on the first product
  await page.locator('.s-result-item h2 a').first().click();
  
  // Check if product title exists
  await expect(page.locator('id=productTitle')).toBeVisible();
  
  // Check if "Add to Cart" button exists
  await expect(page.locator('id=add-to-cart-button')).toBeVisible();
});

/**
 * Test Case 4: Add to Cart
 * This checks if we can add products to the shopping cart
 */
test('Add product to cart', async ({ page }) => {
  await page.goto('https://www.amazon.com');
  await page.fill('id=twotabsearchtextbox', 'mouse');
  await page.click('id=nav-search-submit-button');
  await page.locator('.s-result-item h2 a').first().click();
  
  // Add to cart
  await page.click('id=add-to-cart-button');
  
  // Check if product was added successfully
  await expect(page.locator('span:has-text("Added to Cart")')).toBeVisible({ timeout: 10000 });
  
  // Check cart count
  const cartCount = await page.locator('id=nav-cart-count').textContent();
  expect(parseInt(cartCount)).toBeGreaterThan(0);
});

/**
 * Test Case 5: Shopping Cart Management
 * This checks if we can view and modify the cart
 */
test('View and update shopping cart', async ({ page }) => {
  // First add a product to cart
  await page.goto('https://www.amazon.com');
  await page.fill('id=twotabsearchtextbox', 'book');
  await page.click('id=nav-search-submit-button');
  await page.locator('.s-result-item h2 a').first().click();
  await page.click('id=add-to-cart-button');
  
  // Go to cart
  await page.click('id=nav-cart');
  
  // Check if cart page loaded
  await expect(page.locator('h1:has-text("Shopping Cart")')).toBeVisible();
  
  // Update quantity
  await page.selectOption('select.quantity', '2');
  
  // Check if subtotal updates
  await expect(page.locator('.sc-subtotal')).toBeVisible();
});

/**
 * Test Case 6: User Login
 * This tests the login functionality
 */
test('User login process', async ({ page }) => {
  await page.goto('https://www.amazon.com');
  
  // Hover over the account menu
  await page.hover('id=nav-link-accountList');
  
  // Click Sign in button
  await page.click('text=Sign in');
  
  // Check if we're on the login page
  await expect(page.locator('h1:has-text("Sign-In")')).toBeVisible();
  
  // Fill in email
  await page.fill('input[name="email"]', 'test@example.com');
  
  // Click Continue
  await page.click('id=continue');
  
  // Would normally fill password, but we'll stop here to avoid actual login attempts
  await expect(page.locator('input[name="password"]')).toBeVisible();
});

/**
 * Test Case 7: User Registration
 * This tests the registration process for new users
 */
test('New user registration', async ({ page }) => {
  await page.goto('https://www.amazon.com');
  await page.hover('id=nav-link-accountList');
  
  // Click on "Start here" for new customers
  await page.click('text=Start here.');
  
  // Check if we're on the registration page
  await expect(page.locator('h1:has-text("Create account")')).toBeVisible();
  
  // Fill registration form (we won't submit to avoid creating actual accounts)
  await page.fill('input[name="customerName"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'Password123!');
  await page.fill('input[name="passwordCheck"]', 'Password123!');
  
  // Verify submit button exists
  await expect(page.locator('id=continue')).toBeVisible();
});

/**
 * Test Case 8: Product Filtering
 * This tests if we can filter search results
 */
test('Filter search results', async ({ page }) => {
  await page.goto('https://www.amazon.com');
  await page.fill('id=twotabsearchtextbox', 'smartphone');
  await page.click('id=nav-search-submit-button');
  
  // Filter by brand (e.g., Samsung)
  await page.click('text=Samsung >> input[type="checkbox"]');
  
  // Wait for results to update
  await page.waitForSelector('.s-result-item');
  
  // Check if results contain Samsung
  const filterResults = await page.locator('.s-result-item h2').first().textContent();
  expect(filterResults.toLowerCase()).toContain('samsung');
});

/**
 * Test Case 9: Product Sorting
 * This tests if we can sort search results
 */
test('Sort search results', async ({ page }) => {
  await page.goto('https://www.amazon.com');
  await page.fill('id=twotabsearchtextbox', 'watch');
  await page.click('id=nav-search-submit-button');
  
  // Open sort dropdown
  await page.click('span.a-dropdown-label:has-text("Sort by:")');
  
  // Sort by price: low to high
  await page.click('a:has-text("Price: Low to High")');
  
  // Wait for results to update
  await page.waitForSelector('.s-result-item');
  
  // We would ideally check if prices are in ascending order
  // This would require more complex logic to extract and compare prices
});

/**
 * Test Case 10: Address Management
 * This tests adding and editing shipping addresses
 */
test('Add new shipping address', async ({ page }) => {
  // Login first (simplified)
  await page.goto('https://www.amazon.com');
  await page.hover('id=nav-link-accountList');
  await page.click('text=Account');
  
  // Go to addresses
  await page.click('text=Your addresses');
  
  // Click add address
  await page.click('id=ya-myab-plus-address-icon');
  
  // Check if address form appears
  await expect(page.locator('h2:has-text("Add a new address")')).toBeVisible();
  
  // Fill address form (partial)
  await page.fill('input[name="address-ui-widgets-enterAddressFullName"]', 'John Doe');
  await page.fill('input[name="address-ui-widgets-enterAddressPhoneNumber"]', '1234567890');
  await page.fill('input[name="address-ui-widgets-enterAddressLine1"]', '123 Test St');
  
  // Would continue with city, state, zip, etc.
});

/**
 * Test Case 11: Payment Method Management
 * This tests adding and managing payment methods
 */
test('Add new payment method', async ({ page }) => {
  // Login first (simplified)
  await page.goto('https://www.amazon.com');
  await page.hover('id=nav-link-accountList');
  await page.click('text=Account');
  
  // Go to payment options
  await page.click('text=Payment options');
  
  // Add a payment method
  await page.click('text=Add a payment method');
  
  // Choose credit/debit card
  await page.click('text=Add a credit or debit card');
  
  // Check if card form appears
  await expect(page.locator('h1:has-text("Add a credit or debit card")')).toBeVisible();
  
  // We would not actually fill in card details in a test
});

/**
 * Test Case 12: Wishlist Functionality
 * This tests adding products to a wishlist
 */
test('Add product to wishlist', async ({ page }) => {
  await page.goto('https://www.amazon.com');
  await page.fill('id=twotabsearchtextbox', 'toy');
  await page.click('id=nav-search-submit-button');
  await page.locator('.s-result-item h2 a').first().click();
  
  // Click add to list button
  await page.click('id=add-to-wishlist-button-submit');
  
  // Check confirmation
  await expect(page.locator('text=Added to')).toBeVisible({ timeout: 10000 });
});

/**
 * Test Case 13: Product Reviews
 * This tests viewing product reviews
 */
test('View product reviews', async ({ page }) => {
  await page.goto('https://www.amazon.com');
  await page.fill('id=twotabsearchtextbox', 'bluetooth speaker');
  await page.click('id=nav-search-submit-button');
  await page.locator('.s-result-item h2 a').first().click();
  
  // Click on reviews link
  await page.click('a:has-text("customer reviews")');
  
  // Check if reviews section is visible
  await expect(page.locator('#cm_cr-review_list')).toBeVisible();
  
  // Check if star ratings are visible
  await expect(page.locator('.a-icon-star')).toBeVisible();
});

/**
 * Test Case 14: Language Settings
 * This tests changing the website language
 */
test('Change language settings', async ({ page }) => {
  await page.goto('https://www.amazon.com');
  
  // Click on language settings
  await page.click('id=icp-nav-flyout');
  
  // Select a different language (e.g., Spanish)
  await page.click('text=español - ES');
  
  // Save changes
  await page.click('input[aria-labelledby="icp-save-button-announce"]');
  
  // Check if language changed
  await expect(page.locator('text=Hola,')).toBeVisible({ timeout: 10000 });
});

/**
 * Test Case 15: Responsive Design Testing
 * This tests if the website works on different screen sizes
 */
test('Check responsive design on mobile', async ({ browser }) => {
  // Create a new page with mobile dimensions
  const mobilePage = await browser.newPage({
    viewport: { width: 375, height: 667 } // iPhone dimensions
  });
  
  await mobilePage.goto('https://www.amazon.com');
  
  // Check if mobile menu is visible
  await expect(mobilePage.locator('id=nav-hamburger-menu')).toBeVisible();
  
  // Open mobile menu
  await mobilePage.click('id=nav-hamburger-menu');
  
  // Check if menu items are visible
  await expect(mobilePage.locator('.hmenu-item')).toBeVisible();
});

/**
 * Test Case 16: Product Comparison
 * This tests comparing multiple products
 */
test('Compare similar products', async ({ page, context }) => {
  await page.goto('https://www.amazon.com');
  await page.fill('id=twotabsearchtextbox', 'gaming laptop');
  await page.click('id=nav-search-submit-button');
  
  // Open first product in current tab
  const firstProductTitle = await page.locator('.s-result-item h2').first().textContent();
  await page.locator('.s-result-item h2 a').first().click();
  
  // Get price of first product
  const firstProductPrice = await page.locator('.a-price .a-offscreen').first().textContent();
  
  // Go back to search results
  await page.goBack();
  
  // Open second product in new tab
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('.s-result-item h2 a').nth(1).click({ modifiers: ['Control'] }) // Right-click + open in new tab
  ]);
  
  await newPage.waitForLoadState();
  
  // Get second product info
  const secondProductTitle = await newPage.locator('#productTitle').textContent();
  const secondProductPrice = await newPage.locator('.a-price .a-offscreen').first().textContent();
  
  // Compare products (simplified comparison)
  console.log(`Product 1: ${firstProductTitle.trim()} - ${firstProductPrice}`);
  console.log(`Product 2: ${secondProductTitle.trim()} - ${secondProductPrice}`);
});

/**
 * Test Case 17: Order History and Tracking
 * This tests viewing past orders and tracking information
 */
test('View order history', async ({ page }) => {
  // Login first (simplified)
  await page.goto('https://www.amazon.com');
  await page.hover('id=nav-link-accountList');
  await page.click('text=Sign in');
  
  // After login, go to orders
  await page.click('id=nav-orders');
  
  // Check if orders page loaded
  await expect(page.locator('h1:has-text("Your Orders")')).toBeVisible();
  
  // Try to view a specific order
  // Note: This assumes there are orders in the history
  await page.click('text=Order Details');
  
  // Check if order details page loaded
  await expect(page.locator('h1:has-text("Order Details")')).toBeVisible();
});

/**
 * Test Case 18: Gift Cards and Promotions
 * This tests applying gift cards and promo codes
 */
