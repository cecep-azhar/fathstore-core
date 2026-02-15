'use server'

/**
 * Server Action: Submit a product review
 *
 * Validates the form data and creates a review via Payload REST API.
 * Only works if the user has a completed order containing the product.
 */

const PAYLOAD_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export interface ReviewFormState {
  success: boolean
  error?: string
  message?: string
}

export async function submitReview(
  prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const productId = formData.get('productId') as string
  const orderId = formData.get('orderId') as string
  const rating = parseInt(formData.get('rating') as string)
  const title = formData.get('title') as string
  const body = formData.get('body') as string
  const token = formData.get('token') as string // JWT auth token

  // Validation
  if (!productId || !orderId) {
    return { success: false, error: 'Product and Order are required.' }
  }
  if (!rating || rating < 1 || rating > 5) {
    return { success: false, error: 'Rating must be between 1 and 5.' }
  }
  if (!title || title.trim().length < 3) {
    return { success: false, error: 'Title must be at least 3 characters.' }
  }
  if (!body || body.trim().length < 10) {
    return { success: false, error: 'Review body must be at least 10 characters.' }
  }

  try {
    const response = await fetch(`${PAYLOAD_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
      body: JSON.stringify({
        product: productId,
        order: orderId,
        author: '', // Will be set by the logged-in user context
        rating,
        title: title.trim(),
        body: body.trim(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const message = errorData?.errors?.[0]?.message
        || 'Failed to submit review. Make sure you have a completed order for this product.'
      return { success: false, error: message }
    }

    return {
      success: true,
      message: 'Review submitted successfully! Thank you for your feedback.',
    }
  } catch (error) {
    return {
      success: false,
      error: 'Something went wrong. Please try again later.',
    }
  }
}
