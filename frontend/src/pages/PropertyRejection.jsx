import React from 'react';
import { 
  XCircle, 
  ArrowLeft, 
  Home,
  MessageCircle,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { motion } from "framer-motion";

const BookingCancelPage = () => {
  const handleRetryBooking = () => {
    // Go back to previous page or specific property
    window.history.back();
  };

  const handleContactSupport = () => {
    // Open email client or support chat
    window.open('mailto:support@yourapp.com?subject=Booking Issue', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-white">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg border border-red-500/30 shadow-xl overflow-hidden"
        >
          <div className="p-8 sm:p-12">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <XCircle className="text-red-500 w-20 h-20" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-white w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Title and Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-red-400 mb-4">
                Booking Cancelled
              </h1>
              <p className="text-xl text-gray-300 mb-2">
                Your reservation has been cancelled
              </p>
              <p className="text-emerald-400 text-lg">
                No charges have been made to your account
              </p>
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-700 bg-opacity-50 rounded-lg p-6 mb-8 border border-gray-600/50"
            >
              <div className="flex items-start gap-3">
                <MessageCircle className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-emerald-400 mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    If you encountered any issues during the booking process or have questions about our properties, 
                    our support team is here to help. We're available 24/7 to assist you with your travel needs.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Reasons for Cancellation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-700 bg-opacity-30 rounded-lg p-6 mb-8"
            >
              <h3 className="font-semibold text-gray-300 mb-4">Common reasons for booking cancellation:</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  Payment processing issues
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  Session timeout during checkout
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  Browser or network connectivity issues
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  User cancelled the transaction
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="space-y-4"
            >
              <motion.button
                onClick={handleRetryBooking}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw size={20} />
                Try Booking Again
              </motion.button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  onClick={handleContactSupport}
                  className="bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-emerald-500/30 hover:border-emerald-500/50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle size={18} />
                  Contact Support
                </motion.button>

                <motion.button
                  onClick={() => window.location.href = '/'}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-gray-600/50 hover:border-gray-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home size={18} />
                  Browse Properties
                </motion.button>
              </div>
            </motion.div>

            {/* Footer Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center mt-8 pt-6 border-t border-gray-700"
            >
              <p className="text-sm text-gray-400">
                Thank you for choosing our platform. We hope to help you find your perfect stay soon!
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingCancelPage;