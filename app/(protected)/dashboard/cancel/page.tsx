import Link from "next/link";
import { XCircle } from "lucide-react";

const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md transform rounded-lg bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105">
        <div className="text-center">
          <div className="flex justify-center">
            <XCircle className="mb-4 h-16 w-16 animate-bounce text-red-500" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Payment Cancelled
          </h2>
          <p className="mb-6 text-gray-600">
            Your payment process has been cancelled.
          </p>
          <Link
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
            href="/cart"
          >
            Return to Order List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
