import { ReviewForm } from '@/components/ReviewForm'

interface ReviewPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function NewReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
      <p className="text-gray-500 mb-8">
        Share your experience with other shoppers. You can only review products from completed orders.
      </p>

      <div className="max-w-2xl">
        <ReviewForm orderId={params.orderId} />
      </div>
    </div>
  )
}
