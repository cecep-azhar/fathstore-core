import { test, expect } from '@playwright/test';

const STORE_URL = 'http://localhost:3001';
const ADMIN_URL = 'http://localhost:3000';
const MEMBER_URL = 'http://localhost:3002';

// Use a unique email for each test run to avoid collision
const testEmail = `testuser_${Date.now()}@example.com`;
const testPassword = 'password123';

test.describe('E2E Flow: Purchase -> Admin Accept -> Member Rating', () => {

  test('Complete E2E Store Flow', async ({ page }) => {
    
    // --- STEP 1: REGISTER AS A NEW MEMBER ---
    await test.step('Member Registration', async () => {
      await page.goto(`${MEMBER_URL}/register`);
      await page.fill('input[name="name"]', 'Test User E2E');
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="password"]', testPassword);
      await page.click('button[type="submit"]');
      
      // Wait to ensure login is complete before moving to store
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/.*dashboard|.*orders|.*profile|.*login|.*\//);
    });

    // --- STEP 2: PURCHASE PRODUCT IN STORE ---
    await test.step('Purchase Product', async () => {
      // Go to products page and add to cart
      await page.goto(`${STORE_URL}/products`);
      // Click the first product link
      await page.locator('a[href^="/products/"]').first().click();
      
      // Add to Cart
      await page.click('button:has-text("Add to Cart"), button:has-text("Tambah ke Keranjang"), button:has-text("Beli")');
      
      // Go to checkout
      await page.goto(`${STORE_URL}/checkout`);

      
      // Add new address
      await page.click('button:has-text("Add New Address"), button:has-text("Tambah Alamat")');
      await page.fill('input[placeholder*="Name"], input[placeholder*="Nama"]', 'Test User E2E');
      await page.fill('input[placeholder*="Phone"], input[placeholder*="Telepon"]', '08123456789');
      
      // Try to select Country (Singapore/Indonesia) if available
      try {
        await page.selectOption('select:has-text("Singapore"), select:has-text("Indonesia")', 'Indonesia');
      } catch (e) {
        // Ignore if country select is not present
      }
      
      // Wait for provinces to load
      await page.waitForTimeout(1000);
      const selects = await page.locator('select').all();
      if (selects.length >= 1) {
         await selects[1]?.selectOption({ index: 1 }); // Province 
         await page.waitForTimeout(1000);
         await selects[2]?.selectOption({ index: 1 }); // City
         await page.waitForTimeout(1000);
         await selects[3]?.selectOption({ index: 1 }); // District
         await page.waitForTimeout(1000);
         await selects[4]?.selectOption({ index: 1 }); // Subdistrict
      }

      await page.fill('input[placeholder*="Postal Code"], input[placeholder*="Kode Pos"]', '12345');
      await page.fill('textarea', 'Jalan Test E2E No. 123');

      await page.click('button:has-text("Use This Address"), button:has-text("Gunakan Alamat Ini")');
      await page.click('button:has-text("Continue to Shipping"), button:has-text("Lanjut ke Pengiriman")');
      
      // Select Shipping
      await page.click('text=Flat Rate');
      await page.click('button:has-text("Continue to Payment")');
      
      // Select Payment
      await page.click('text=Bank Transfer');
      await page.click('button:has-text("Place Order")');

      // Ensure success page is reached
      await expect(page).toHaveURL(/.*payment\/success/);
      
      // Extract Order ID if possible, or just wait for it to process
      await page.waitForTimeout(2000);
    });

    // --- STEP 3: ADMIN ACCOMPLISHES ORDER ---
    await test.step('Admin Accept and Ship Order', async () => {
      await page.goto(`${ADMIN_URL}/admin/login`);
      await page.fill('input[name="email"]', 'admin@fathstore.com');
      await page.fill('input[name="password"]', 'fathstore');
      await page.click('button:has-text("Login")');
      
      await page.waitForTimeout(2000);

      // Go to Orders Collection
      await page.goto(`${ADMIN_URL}/admin/collections/orders`);
      
      // Click the first (newest) order
      await page.locator('table tbody tr').first().locator('a').first().click();

      // Assuming PayloadCMS default UI: Find Fulfillment Status and set to 'shipped'
      // Payload select fields usually have a specific accessible structure, 
      // wait for UI to load
      await page.waitForTimeout(2000);

      // In Payload, we usually click the react-select dropdown
      await page.locator('label:has-text("Fulfillment Status")').locator('..').click();
      await page.locator('div[class*="rs__option"]:has-text("shipped")').click();

      // Click Save
      await page.click('button:has-text("Save")');
      
      await page.waitForTimeout(2000);
    });

    // --- STEP 4: MEMBER RECEIVES AND RATES ---
    await test.step('Member Order Completion and Rating', async () => {
      await page.goto(`${MEMBER_URL}/orders`);
      
      // Login if session timed out, though Playwright context keeps cookies
      // Click first order
      await page.locator('a[href^="/orders/"]').first().click();
      
      // Mark as received
      await page.click('button:has-text("Pesanan Diterima")');
      
      // Confirm dialog (Playwright auto-dismisses dialogs unless handled, we need to handle it)
      page.on('dialog', dialog => dialog.accept());
      
      await page.waitForTimeout(2000);
      
      // Click write review
      await page.click('text=Write a Review');
      
      // Assuming Review form has stars and text area
      await page.click('.lucide-star >> nth=4'); // click 5th star
      await page.fill('input[name="title"]', 'Great Product!');
      await page.fill('textarea[name="body"]', 'I really like this product, testing from E2E.');
      
      await page.click('button:has-text("Submit Review")');
      
      await page.waitForTimeout(2000);
    });

  });
});
