import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;

try {
  // Intentamos inicializar Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error: unknown) {
  // Si ya existe una instancia, obtenemos la actual
  if (error instanceof Error && /already exists/.test(error.message)) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    console.error('Firebase initialization error:', error);
    // Proporcionamos valores por defecto para evitar undefined
    app = {} as FirebaseApp;
    auth = {} as Auth;
  }
}

export { auth };
export default app;