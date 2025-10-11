import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import GoogleLoginCompact from "./GoogleLoginCompact";

const GoogleLoginPrompt = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("translate-x-full opacity-0");

  useEffect(() => {
    // Only show the prompt if user is not authenticated
    if (!isAuthenticated) {
      // Set a timeout to show the prompt after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Add a slight delay before starting the animation
        setTimeout(() => {
          setAnimationClass("translate-x-0 opacity-100");
        }, 100);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleClose = () => {
    setAnimationClass("translate-x-full opacity-0");
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  };

  if (!isVisible || isAuthenticated) return null;

  return (
    <div 
      className={`fixed top-4 right-4 bg-white shadow-lg rounded-lg p-5 z-50 border border-gray-200 w-80 transition-all duration-500 ease-in-out ${animationClass}`}
      style={{ 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-5 h-5 mr-2" 
          />
          <h3 className="text-lg font-medium">Sign in with Google</h3>
        </div>
        <button 
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <h2 className="text-xl font-medium mb-1">Use your Google Account</h2>
      <h3 className="text-base font-medium mb-4 text-gray-700">to sign in to Adia</h3>
      
      <p className="text-sm text-gray-600 mb-5">
        No more passwords to remember. Signing in is fast, simple and secure.
      </p>
      
      <div className="flex justify-center items-center mb-2">
        <img 
          src="/public/adia.woff2" 
          alt="MbokaLink Logo" 
          className="w-8 h-8 mr-2" 
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="flex space-x-2">
          {['#4285F4', '#EA4335', '#FBBC05', '#34A853'].map((color, i) => (
            <div 
              key={i} 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      
      <GoogleLoginCompact />
    </div>
  );
};

export default GoogleLoginPrompt; 