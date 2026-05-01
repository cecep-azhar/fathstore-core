# Collection Schema — FathStore Core

Dokumentasi schema Payload CMS collections.

---

## Users

```typescript
{
  slug: 'users',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'select', options: ['admin', 'member', 'merchant'] },
    { name: 'phone', type: 'text' },
    { name: 'dateOfBirth', type: 'date' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },           // rumah, kantor, dll
        { name: 'fullName', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'street', type: 'text' },
        { name: 'province', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'isDefault', type: 'checkbox' },
      ]
    },
    { name: 'subscribedToNewsletter', type: 'checkbox' },
    { name: 'marketingNotes', type: 'textarea' },
  ]
}
```

**Catatan:** `addresses` adalah embedded array. Untuk multi-alamat yang lebih robust, pertimbangkan pisahkan ke collection `address-books`.

---

## Products

```typescript
{
  slug: 'products',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'description', type: 'richText' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'images', type: 'array', fields: [{ type: 'upload', relationTo: 'media' }] },
    { name: 'price', type: 'number', required: true },
    { name: 'compareAtPrice', type: 'number' },
    { name: 'sku', type: 'text' },
    { name: 'barcode', type: 'text' },
    { name: 'trackInventory', type: 'checkbox' },
    { name: 'stock', type: 'number' },
    { name: 'continueSellingWhenOutOfStock', type: 'checkbox' },
    { name: 'hasVariants', type: 'checkbox' },
    // variants array dengan options (size, color, dll)
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    { name: 'productType', type: 'select', options: ['physical', 'digital'] },
    { name: 'vendor', type: 'relationship', relationTo: 'tenants' }, // ← untuk brand filter
    { name: 'status', type: 'select', options: ['draft', 'published'] },
    { name: 'featured', type: 'checkbox' },
    {
      name: 'shipping',
      type: 'group',
      fields: [
        { name: 'isPhysicalProduct', type: 'checkbox' },
        { name: 'weight', type: 'number' },  // gram
        { name: 'length', type: 'number' },  // cm
        { name: 'width', type: 'number' },
        { name: 'height', type: 'number' },
      ]
    },
    { name: 'seo', type: 'json' },
    { name: 'publishedAt', type: 'date' },
  ]
}
```

---

## Orders

```typescript
{
  slug: 'orders',
  fields: [
    { name: 'orderNumber', type: 'text', unique: true },  // FS-xxx format
    { name: 'customer', type: 'relationship', relationTo: 'users' },
    { name: 'customerEmail', type: 'email' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'productTitle', type: 'text' },
        { name: 'variantTitle', type: 'text' },
        { name: 'sku', type: 'text' },
        { name: 'quantity', type: 'number' },
        { name: 'unitPrice', type: 'number' },
        { name: 'totalPrice', type: 'number' },
        { name: 'image', type: 'text' },
      ]
    },
    { name: 'subtotal', type: 'number' },
    { name: 'discountCode', type: 'text' },
    { name: 'discountAmount', type: 'number' },
    { name: 'shippingCost', type: 'number' },
    { name: 'tax', type: 'number' },
    { name: 'total', type: 'number' },
    { name: 'paymentStatus', type: 'select', options: ['pending', 'paid', 'failed', 'refunded'] },
    { name: 'fulfillmentStatus', type: 'select', options: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
    { name: 'paymentMethod', type: 'select', options: ['qris', 'bank_transfer', 'midtrans', 'cod', 'other'] },
    { name: 'paymentData', type: 'json' },  // midtrans, qris, dll data
    { name: 'proofUrl', type: 'text' },  // bukti transfer
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'fullName', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'province', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'district', type: 'text' },
        { name: 'subdistrict', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'street', type: 'text' },
        { name: 'country', type: 'text' },
      ]
    },
    { name: 'trackingNumber', type: 'text' },  // resi pengiriman
    { name: 'shippingCarrier', type: 'text' }, // JNE, J&T, dll
    { name: 'notes', type: 'textarea' },
    { name: 'customerNotes', type: 'textarea' },
  ]
}
```

---

## Locations

### Provinces
```typescript
{
  slug: 'provinces',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', unique: true },
  ]
}
```

### Cities
```typescript
{
  slug: 'cities',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'type', type: 'select', options: ['Kota', 'Kabupaten'] },
    { name: 'province', type: 'relationship', relationTo: 'provinces' },
    { name: 'postalCode', type: 'text' },
  ]
}
```

### Districts
```typescript
{
  slug: 'districts',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'city', type: 'relationship', relationTo: 'cities' },
  ]
}
```

### Subdistricts
```typescript
{
  slug: 'subdistricts',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'district', type: 'relationship', relationTo: 'districts' },
    { name: 'postalCode', type: 'text' },
  ]
}
```

---

## Shipping

### ShippingZones
```typescript
{
  slug: 'shipping-zones',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'countries', type: 'array', fields: [{ name: 'country', type: 'text' }] },
    { name: 'provinces', type: 'array', fields: [{ name: 'province', type: 'relationship', relationTo: 'provinces' }] },
    { name: 'isActive', type: 'checkbox' },
    { name: 'isDefault', type: 'checkbox' },
  ]
}
```

### ShippingRates
```typescript
{
  slug: 'shipping-rates',
  fields: [
    { name: 'zone', type: 'relationship', relationTo: 'shipping-zones' },
    { name: 'name', type: 'text' },
    { name: 'method', type: 'select', options: ['flat', 'per_item', 'weight', 'price', 'free', 'pickup'] },
    { name: 'cost', type: 'number' },
    { name: 'costPerUnit', type: 'number' },
    { name: 'minOrderValue', type: 'number' },
    { name: 'maxOrderValue', type: 'number' },
    { name: 'minWeight', type: 'number' },
    { name: 'maxWeight', type: 'number' },
    { name: 'estimatedDays', type: 'text' },
    { name: 'carrier', type: 'text' },
    { name: 'trackingEnabled', type: 'checkbox' },
    { name: 'isActive', type: 'checkbox' },
    { name: 'isDefault', type: 'checkbox' },
    { name: 'sortOrder', type: 'number' },
  ]
}
```

### ShippingProviders
```typescript
{
  slug: 'shipping-providers',
  fields: [
    { name: 'name', type: 'text', required: true },       // JNE, J&T, SiCepat, dll
    { name: 'slug', type: 'text' },                       // jne, jt, sicepat
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'trackingUrl', type: 'text' },
    { name: 'apiKey', type: 'text' },
    { name: 'isActive', type: 'checkbox' },
  ]
}
```

---

## Tenants (Brand/Company)

```typescript
{
  slug: 'tenants',
  fields: [
    { name: 'name', type: 'text', required: true },      // Exortive, Zunika, Ngombe
    { name: 'slug', type: 'text', unique: true, required: true }, // exortive, zunika, ngombe
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'textarea' },
    {
      name: 'theme',
      type: 'group',
      fields: [
        { name: 'primaryColor', type: 'text' },          // #000000
        { name: 'secondaryColor', type: 'text' },
        { name: 'fontFamily', type: 'text' },
      ]
    },
    { name: 'contactEmail', type: 'email' },
    { name: 'contactPhone', type: 'text' },
    { name: 'address', type: 'textarea' },
    { name: 'socialLinks', type: 'json' },
    { name: 'isActive', type: 'checkbox' },
  ]
}
```

---

## Banks

```typescript
{
  slug: 'banks',
  fields: [
    { name: 'name', type: 'text', required: true },           // Bank BCA
    { name: 'code', type: 'text' },                           // BCA
    { name: 'accountNumber', type: 'text', required: true },
    { name: 'accountHolder', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'active', type: 'checkbox' },
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' }, // brand-specific
  ]
}
```

---

## Sliders

### HeroSliders
```typescript
{
  slug: 'hero-sliders',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'buttonText', type: 'text' },
    { name: 'buttonLink', type: 'text' },
    { name: 'active', type: 'checkbox' },
    { name: 'order', type: 'number' },
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' }, // brand filter
  ]
}
```

### Brands (Brand Logos Slider)
```typescript
{
  slug: 'brands',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'link', type: 'text' },
    { name: 'active', type: 'checkbox' },
    { name: 'order', type: 'number' },
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
  ]
}
```

---

## Discounts

```typescript
{
  slug: 'discounts',
  fields: [
    { name: 'code', type: 'text', unique: true, required: true },
    { name: 'type', type: 'select', options: ['percentage', 'fixed'] },
    { name: 'value', type: 'number', required: true },
    { name: 'minOrderValue', type: 'number' },
    { name: 'maxDiscount', type: 'number' },  // untuk percentage
    { name: 'usageLimit', type: 'number' },
    { name: 'usedCount', type: 'number' },
    { name: 'startDate', type: 'date' },
    { name: 'endDate', type: 'date' },
    { name: 'isActive', type: 'checkbox' },
    { name: 'applicableProducts', type: 'relationship', relationTo: 'products', many: true },
    { name: 'applicableCategories', type: 'relationship', relationTo: 'categories', many: true },
  ]
}
```

---

*Last updated: 2026-05-01*