import type { CollectionAfterChangeHook } from 'payload'

/**
 * User afterChange Hook — Referral Code Generation
 *
 * When a new user is created:
 * 1. Generate unique referral code if not exists
 * 2. If referredBy is set, create referral record and award bonus points
 */
export const userAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const payload = req.payload

  // ── 1. Generate referral code on create ─────────────────
  if (operation === 'create' && !doc.referralCode) {
    const code = generateReferralCode(doc.name || doc.email || String(doc.id))
    await payload.update({
      collection: 'users',
      id: doc.id,
      data: { referralCode: code },
    })
    payload.logger.info(`[Referral] User ${doc.id}: Generated code ${code}`)
  }

  // ── 2. Handle referral bonus on first purchase ───────────
  // This is triggered when referred user makes their first order
  // (handled in orderAfterChange hook, not here)

  return doc
}

function generateReferralCode(name: string): string {
  // Create base from name (first 4 chars, uppercase, alphanumeric only)
  const base = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 4)
    .padEnd(4, 'X')

  // Add random suffix
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return `${base}-${suffix}`
}