import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { useLocation } from "react-router-dom";
import axios from "../lib/axios";

// Confetti component
const Confetti = ({ width, height, gravity, numberOfPieces, recycle }) => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const newPieces = Array.from({ length: numberOfPieces }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 1,
      color: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'][Math.floor(Math.random() * 4)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    }));
    setPieces(newPieces);

    if (!recycle) {
      const timer = setTimeout(() => setPieces([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [width, height, numberOfPieces, recycle]);

  useEffect(() => {
    if (pieces.length === 0) return;

    const animate = () => {
      setPieces(prevPieces => 
        prevPieces.map(piece => ({
          ...piece,
          x: piece.x + piece.vx,
          y: piece.y + piece.vy + gravity,
          vy: piece.vy + gravity,
          rotation: piece.rotation + piece.rotationSpeed
        })).filter(piece => piece.y < height + 20)
      );
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [pieces.length, height, gravity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: '2px'
          }}
        />
      ))}
    </div>
  );
};

const PurchaseSuccessPage = () => {
  const [showContent, setShowContent] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (sessionId) {
      axios.post("/payments/checkout-success", { sessionId })
        .then(res => setBooking(res.data))
        .catch(err => {/* handle error */});
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-white flex items-center justify-center">
      <Confetti
        width={typeof window !== 'undefined' ? window.innerWidth : 1200}
        height={typeof window !== 'undefined' ? window.innerHeight : 800}
        gravity={0.1}
        numberOfPieces={150}
        recycle={false}
      />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        {showContent && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="animate-bounce">
                  <CheckCircle className="text-emerald-400 w-32 h-32" />
                </div>
              </div>
              
              <h1 className="text-6xl font-bold text-emerald-400 mb-6 animate-pulse">
                Purchase Successful!
              </h1>
              
              <p className="text-2xl text-gray-300 mb-8">
                Thank you for your purchase!
              </p>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl border border-emerald-500/30 p-8 mb-8">
              <div className="flex items-center justify-center gap-3 text-emerald-400 text-lg">
                <CheckCircle size={24} />
                <span className="font-semibold">Payment Processed Successfully</span>
              </div>
              <p className="text-gray-300 mt-4">
                Your transaction has been completed successfully.
              </p>
            </div>

            <div className="flex justify-center">
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 hover:shadow-xl"
                onClick={() => window.location.href = '/'}
              >
                <Home size={20} />
                Return Home
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PurchaseSuccessPage;