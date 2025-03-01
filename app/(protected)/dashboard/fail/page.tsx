import Link from "next/link";
import { AlertCircle } from "lucide-react";

const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md transform rounded-lg bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105">
        <div className="text-center">
          <div className="flex justify-center">
            <AlertCircle className="mb-4 h-16 w-16 animate-bounce text-yellow-500" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Payment Failed
          </h2>
          <p className="mb-6 text-gray-600">
            Your payment process could not be completed.
          </p>
          <Link
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
            href="/cart"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
