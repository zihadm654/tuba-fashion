"use client";

import { useState } from "react";
import { createReview } from "@/actions/review";
import { Star, StarHalf } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({
  productId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createReview(productId, rating, comment);
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleRatingClick(value)}
            className="text-yellow-400 hover:text-yellow-500 focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${value <= rating ? "fill-current" : ""}`}
            />
          </button>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review here..."
        className="min-h-[100px]"
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
