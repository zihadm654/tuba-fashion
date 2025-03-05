import { getProductReviews } from "@/actions/review";
import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
}

interface ReviewListProps {
  productId: string;
}

export default async function ReviewList({ productId }: ReviewListProps) {
  const reviews = await getProductReviews(productId);
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${index < review.rating ? "fill-current text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              {review.user.image && (
                <img
                  src={review.user.image}
                  alt={review.user.name || "User"}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <span className="font-medium">
                {review.user.name || "Anonymous"}
              </span>
            </div>
            {review.comment && (
              <p className="mt-2 text-gray-600">{review.comment}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
