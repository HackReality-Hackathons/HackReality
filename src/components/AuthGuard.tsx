// src/components/AuthGuard.tsx
import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inicializar Firebase
    const firebaseConfig = {
      apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
      authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
    };

    try {
      initializeApp(firebaseConfig);
    } catch (error: any) {
      if (!/already exists/.test(error.message)) {
        console.error('Firebase initialization error:', error);
      }
    }

    const auth = getAuth();
    let emailInitialized = false;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = '/auth';
        return;
      }

      if (!emailInitialized && user.email) {
        emailInitialized = true;
        // Solo inicializar el email una vez
        const input = document.getElementById('recipient') as HTMLInputElement;
        if (input) {
          input.value = user.email;
          // Agregar el botón use email
          const container = input.parentElement;
          if (container) {
            const button = document.createElement('button');
            button.className = 'absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-md transition-colors';
            button.textContent = 'Use Email';
            button.onclick = (e) => {
              e.preventDefault();
              input.value = user.email || '';
            };
            container.appendChild(button);
          }
        }
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;