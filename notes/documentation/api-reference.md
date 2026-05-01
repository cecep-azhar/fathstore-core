# API Reference — FathStore Core

Dokumentasi API routes di FathStore Core.

---

## Existing APIs

### Payment APIs

#### QRIS Generate
```
POST /api/qris/generate
```

Generate QRIS QR code sebagai DataURL.

**Request:**
```json
{
  "amount": 150000,
  "merchantId": "QRIS_MERCHANT_ID",
  "orderId": "ORD-12345"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrDataUrl": "data:image/png;base64,...",
    "expiresAt": "2026-05-01T12:30:00Z"
  }
}
```

---

#### Midtrans Token
```
POST /api/midtrans/token
```

Create Midtrans Snap token untuk payment page.

**Request:**
```json
{
  "orderId": "ORD-12345",
  "grossAmount": 150000,
  "customerDetails": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "081234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "Midtrans_Snap_Token",
    "redirectUrl": "https://app.midtrans.com/..."
  }
}
```

---

#### Midtrans Webhook
```
POST /api/midtrans/notification
```

Midtrans webhook handler. Auto-approve transaction & create enrollment.

**Payload:** Midtrans notification payload (settlement, pending, expire, etc.)

---

#### Approve Transaction (Bank Transfer)
```
POST /api/transactions/{id}/approve
```

Admin approve bank transfer payment.

**Request:**
```json
{
  "approvedBy": "admin-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction approved"
}
```

---

### Location APIs (apps/store)

#### Get Provinces
```
GET /api/locations/provinces
```

**Response:**
```json
{
  "data": [
    { "id": "1", "name": "DKI Jakarta", "code": "31" },
    { "id": "2", "name": "Jawa Barat", "code": "32" }
  ]
}
```

---

#### Get Cities
```
GET /api/locations/cities?provinceId=31
```

**Response:**
```json
{
  "data": [
    { "id": "1", "name": "Kota Jakarta Selatan", "type": "Kota" },
    { "id": "2", "name": "Kabupaten Bogor", "type": "Kabupaten" }
  ]
}
```

---

#### Get Districts
```
GET /api/locations/districts?cityId=1
```

---

#### Get Subdistricts
```
GET /api/locations/subdistricts?districtId=1
```

---

### Other APIs

#### Seed
```
POST /api/seed
```

Seed initial data (lama, perlu diupgrade ke brand-specific).

---

#### Validate Access
```
GET /api/validate-access?materialId=xxx
```

Check if user has access to a material.

---

#### Certificate Generate
```
POST /api/certificates/generate
```

Generate completion certificate PDF.

---

## New APIs to Implement

### Address Book APIs

#### List Addresses
```
GET /api/v1/addresses
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "addr-123",
      "label": "Rumah",
      "fullName": "John Doe",
      "phone": "081234567890",
      "street": "Jl. Sudirman No. 1",
      "province": { "id": "31", "name": "DKI Jakarta" },
      "city": { "id": "1", "name": "Kota Jakarta Selatan" },
      "district": { "id": "1", "name": "Kebayoran Baru" },
      "subdistrict": { "id": "1", "name": "Senayan" },
      "postalCode": "12190",
      "isDefault": true
    }
  ]
}
```

---

#### Create Address
```
POST /api/v1/addresses
Authorization: Bearer {token}
```

**Request:**
```json
{
  "label": "Kantor",
  "fullName": "John Doe",
  "phone": "081234567890",
  "street": "Jl. Gatot Subroto No. 5",
  "provinceId": "31",
  "cityId": "1",
  "districtId": "2",
  "subdistrictId": "5",
  "postalCode": "12990"
}
```

---

#### Update Address
```
PUT /api/v1/addresses/{id}
Authorization: Bearer {token}
```

---

#### Delete Address
```
DELETE /api/v1/addresses/{id}
Authorization: Bearer {token}
```

---

#### Set Default Address
```
PUT /api/v1/addresses/{id}/default
Authorization: Bearer {token}
```

---

### Shipping APIs

#### Calculate Shipping
```
POST /api/v1/shipping/calculate
```

**Request:**
```json
{
  "items": [
    { "productId": "prod-1", "quantity": 2, "weight": 500 },
    { "productId": "prod-2", "quantity": 1, "weight": 300 }
  ],
  "destination": {
    "provinceId": "31",
    "cityId": "1",
    "districtId": "1",
    "subdistrictId": "1",
    "postalCode": "12190"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "provider": "jne",
      "providerName": "JNE",
      "service": "REG",
      "serviceName": "Reguler",
      "cost": 25000,
      "etd": "2-3 hari",
      "isAvailable": true
    },
    {
      "provider": "sicepat",
      "providerName": "SiCepat",
      "service": "SIUNT",
      "serviceName": "SiUntung",
      "cost": 22000,
      "etd": "1-2 hari",
      "isAvailable": true
    }
  ]
}
```

---

#### Generate AWB (Shipping Label)
```
POST /api/v1/shipping/awb
Authorization: Bearer {admin-token}
```

**Request:**
```json
{
  "orderId": "ORD-12345",
  "provider": "jne",
  "service": "REG"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "awb": "JP123456789",
    "labelUrl": "https://...",
    "courier": "JNE",
    "service": "Reguler"
  }
}
```

---

#### Track Shipment
```
GET /api/v1/courier/track?awb=JP123456789&provider=jne
```

**Response:**
```json
{
  "success": true,
  "data": {
    "awb": "JP123456789",
    "status": "on_transit",
    "history": [
      {
        "timestamp": "2026-05-01T10:00:00Z",
        "status": "picked_up",
        "location": "Jakarta",
        "description": "Paket telah diambil dari pengirim"
      },
      {
        "timestamp": "2026-05-01T14:00:00Z",
        "status": "on_transit",
        "location": "Surabaya",
        "description": "Paket dalam perjalanan ke tujuan"
      }
    ]
  }
}
```

---

### Order APIs

#### Update Tracking
```
PUT /api/v1/orders/{id}/tracking
Authorization: Bearer {admin-token}
```

**Request:**
```json
{
  "trackingNumber": "JP123456789",
  "shippingCarrier": "JNE",
  "shippingService": "REG"
}
```

---

#### Update Status
```
PUT /api/v1/orders/{id}/status
Authorization: Bearer {admin-token}
```

**Request:**
```json
{
  "fulfillmentStatus": "shipped"
}
```

---

### Brand/Seed APIs

#### Seed Brand Data
```
POST /api/v1/seed/{brand}
Authorization: Bearer {admin-token}
```

**Brands:** `exortive`, `zunika`, `ngombe`

**Query params:**
- `reset=true` — hapus data lama dulu

**Response:**
```json
{
  "success": true,
  "data": {
    "tenant": { "id": "tenant-123", "name": "Exortive", "slug": "exortive" },
    "categories": 8,
    "products": 24,
    "banks": 4,
    "heroSliders": 5,
    "brandSliders": 3,
    "discounts": 5,
    "shippingProviders": 4,
    "shippingZones": 3
  }
}
```

---

#### Get Brand Config
```
GET /api/v1/brands/{slug}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tenant-123",
    "name": "Exortive",
    "slug": "exortive",
    "logo": "https://...",
    "description": "...",
    "theme": {
      "primaryColor": "#000000",
      "secondaryColor": "#ffffff"
    },
    "contactEmail": "info@exortive.com",
    "contactPhone": "021-1234567"
  }
}
```

---

### Payment Status APIs

#### Check QRIS Status
```
GET /api/v1/payments/qris/status?sessionId={sessionId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "pending", // pending, paid, expired
    "expiresAt": "2026-05-01T12:30:00Z",
    "remainingSeconds": 1800
  }
}
```

---

#### Check Midtrans Status
```
GET /api/v1/payments/midtrans/status?orderId={orderId}
```

---

## Error Responses

Semua API menggunakan format error统一:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "field": "amount", "message": "Amount must be greater than 0" }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | No permission to access |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (duplicate) |
| `INTERNAL_ERROR` | 500 | Server error |
| `EXTERNAL_SERVICE_ERROR` | 502 | External API error (Midtrans, BitShip) |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

*Last updated: 2026-05-01*