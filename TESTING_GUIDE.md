# FathStore - Quick Testing Guide

## 🎯 Quick Start (5 minutes)

### 1. Start Application
```powershell
cd d:\01_WEB\01_Projects\fathstore-core
pnpm dev
```

Wait for: `ready - started server on 0.0.0.0:PORT`

### 2. Access URL
- **Admin Panel**: http://localhost:3000/admin
- **Store Frontend**: http://localhost:3000

---

## 👨‍💼 As ADMIN (Testing Admin Features)

### Login
1. Go to: http://localhost:3000/admin
2. Email: `admin@fathstore.com`
3. Password: `Admin@12345`

### Admin Tests

#### ✅ Test 1: View Orders Dashboard
- [ ] Click "Collections" → "Orders"
- [ ] Verify 8 sample orders appear
- [ ] Check order numbers are unique
- [ ] Verify prices in SGD

**Expected Result**: All orders visible with payment method and status

#### ✅ Test 2: QRIS Payment Order
- [ ] Find order with `paymentMethod: "qris"`
- [ ] Click to view details
- [ ] Check `paymentData` contains `qrisCode`
- [ ] Verify `checkoutCurrency: "SGD"`

**Expected Result**: QRIS payment data visible

#### ✅ Test 3: Bank Transfer Order
- [ ] Find order with `paymentMethod: "bank_transfer"`
- [ ] Click to view details
- [ ] Check `paymentData` shows bank details:
  - Bank Name
  - Account Number
  - Account Holder
- [ ] Verify status is "payment_review" or "paid"

**Expected Result**: Bank transfer details visible and accurate

#### ✅ Test 4: Update Order Status
- [ ] Click on any order
- [ ] Change `paymentStatus` from "pending" → "paid"
- [ ] Change `fulfillmentStatus` from "unfulfilled" → "processing"
- [ ] Click "Save"

**Expected Result**: Status updates persist

#### ✅ Test 5: View Customers
- [ ] Go to Collections → Users
- [ ] Verify 5+ sample customers list
- [ ] Click on a customer
- [ ] Check Singapore address is saved
- [ ] Verify phone number

**Expected Result**: Customer data complete with Singapore addresses

#### ✅ Test 6: Check Banks
- [ ] Go to Collections → Banks
- [ ] Verify 4 bank accounts:
  1. DBS Bank Singapore (048-1234567-8)
  2. OCBC Bank Singapore (7373-123456-001)
  3. Mandiri (142-123456-001)
  4. BCA (8880012345678)

**Expected Result**: All 4 banks visible and active

#### ✅ Test 7: System Settings
- [ ] Go to Globals → Settings
- [ ] Verify currency: SGD
- [ ] Tax rate: 9% (GST)
- [ ] Store address: Singapore
- [ ] Language: English

**Expected Result**: All settings configured for Singapore

---

## 👤 As CUSTOMER (Testing Customer Features)

### Login
1. Go to: http://localhost:3000/login
2. Email: `member@fathstore.com`
3. Password: `Member@12345`
4. Or use test customer: `customer1@example.com` / `Password@123`

### Customer Tests

#### ✅ Test 1: Dashboard
- [ ] Login as customer
- [ ] See dashboard/home page
- [ ] Browse products section

**Expected Result**: Dashboard loads with no errors

#### ✅ Test 2: View Products
- [ ] Navigate to Products/Shop
- [ ] Verify products list with images
- [ ] Check prices are in SGD
- [ ] Click on a product

**Expected Result**: Products display correctly with SGD pricing

#### ✅ Test 3: View Order History
- [ ] Click Account → Order History (or Orders tab)
- [ ] Verify sample orders are listed
- [ ] Check order numbers display

**Expected Result**: Orders appear in customer's history

#### ✅ Test 4: View Order Details
- [ ] Click on any order
- [ ] Check items ordered
- [ ] Verify total in SGD
- [ ] Check payment status
- [ ] Verify fulfillment status

**Expected Result**: Complete order information visible

#### ✅ Test 5: Profile
- [ ] Click Account → Profile
- [ ] Check personal information
- [ ] Verify Singapore address
- [ ] Confirm phone number

**Expected Result**: Profile data complete and correct

---

## 📊 Payment Methods Verification

### Test QRIS Payments
| Order | PaymentMethod | Status | Bank | Notes |
|-------|---------------|--------|------|-------|
| FS-...-1 | qris | paid | - | Has QRIS code |
| FS-...-3 | qris | paid | - | Multiple items |
| FS-...-5 | qris | pending | - | Awaiting payment |
| FS-...-7 | qris | paid | - | With discount |

### Test Bank Transfers
| Order | Bank | Status | Transfer Status |
|-------|------|--------|-----------------|
| FS-...-2 | DBS | payment_review | awaiting_confirmation |
| FS-...-4 | DBS | paid | confirmed |
| FS-...-6 | DBS | failed | Failed |
| FS-...-8 | DBS | pending | awaiting_confirmation |

---

## 🔍 Data Verification Checklist

### Regional Settings
- [ ] Currency displays as SGD
- [ ] Prices in SGD throughout
- [ ] Addresses show Singapore locations
- [ ] Timezone should be Asia/Singapore

### Customers
- [ ] 5 sample customers exist
- [ ] All have Singapore addresses
- [ ] Phone numbers populated
- [ ] Email addresses unique

### Orders
- [ ] 8 sample orders created
- [ ] Mix of QRIS and Bank Transfer
- [ ] Various statuses: pending, paid, failed, completed
- [ ] Order numbers unique
- [ ] Prices consistent (SGD)

### Payment Data
- [ ] QRIS orders have qrisCode
- [ ] Bank Transfer orders have bank details
- [ ] Payment status options: pending, payment_review, paid, failed, refunded
- [ ] Fulfillment status shows progression

---

## ⚠️ Common Issues & Solutions

### Issue: "Database connection failed"
**Solution**:
- Ensure PostgreSQL running: `psql -U postgres -c "SELECT 1"`
- Check `.env.local` has correct DATABASE_URI
- Restart dev server

### Issue: "Port 3000 already in use"
**Solution**:
- Next.js will use 3002 or next available
- Access at: http://localhost:3002/admin
- Or kill process: `netstat -ano | findstr :3000` then `taskkill /PID <PID>`

### Issue: "Module not found" errors
**Solution**:
```powershell
pnpm install
pnpm install -w -D pdf-lib qrcode
```

### Issue: "Cannot create user - email exists"
**Solution**:
- This is expected - seed data only creates if not existing
- Use different email or delete existing user from admin

### Issue: "Orders not appearing"
**Solution**:
- Run seed script: `cd apps/admin && pnpm seed:transactions`
- Refresh browser (Ctrl+F5 hard refresh)
- Check Network tab for API errors

---

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________
Region: Singapore
Currency: SGD

ADMIN TESTS:
☐ Login successful
☐ View 8 orders
☐ QRIS payment visible
☐ Bank transfer visible
☐ Update order status
☐ View 5 customers
☐ 4 banks visible
☐ Settings configured

CUSTOMER TESTS:
☐ Login successful
☐ View products in SGD
☐ Order history visible
☐ Order details complete
☐ Profile data correct

PAYMENT VERIFICATION:
☐ QRIS: _____ orders found
☐ Bank Transfer: _____ orders found
☐ Payment statuses: Pending, Paid, Failed, Review
☐ Bank accounts: 4 configured

ISSUES FOUND:
1. _______________________
2. _______________________
3. _______________________

RECOMMENDATIONS:
_______________________
_______________________

APPROVAL: ☐ PASS  ☐ FAIL  ☐ NEEDS FIXES
```

---

## 🚀 What's Ready

✅ Application is production-ready for testing  
✅ Sample data created (8 orders, 5 customers)  
✅ Both payment methods implemented (QRIS + Bank Transfer)  
✅ Singapore region fully configured  
✅ Admin and customer portals ready  
✅ Database schema complete  

---

## 📞 Need Help?

Check the detailed guide: `ENTERPRISE_SETUP.md`

---

**Created**: April 3, 2026  
**For**: QA Testing Team  
**Next**: Run tests and report results
