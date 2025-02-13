import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

// Define required environment variables for Firebase configuration.
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
]

// Filter out any missing environment variables.
const missingEnvVars = requiredEnvVars.filter(varName => !import.meta.env[varName])

if (missingEnvVars.length > 0) {
  const errorMessage = `
    ========== Environment Configuration Error ==========
    Missing required environment variables:
    ${missingEnvVars.join('\n    ')}
    
    Please follow these steps to resolve:
    1. Verify that the .env file exists.
    2. Copy contents from .env.example to .env.
    3. Provide your actual Firebase configuration in the .env file.
    
    You can retrieve these values from your Firebase Console:
    Firebase Console → Your Project → Project Settings → General → Your Apps
    ===============================================
  `
  console.error(errorMessage)
  showErrorPage(
    'Missing Environment Variables',
    'The application cannot start due to missing required environment variables.',
    missingEnvVars
  )
  throw new Error('Missing required environment variables. Please check your .env file.')
}

// Firebase configuration object.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Display an error page with the provided title, message, and additional details.
function showErrorPage(title, message, details = []) {
  document.body.innerHTML = `
    <div style="
      padding: 20px;
      margin: 50px auto;
      max-width: 800px;
      font-family: sans-serif;
      background: #fff3f3;
      border: 2px solid #ff5252;
      border-radius: 8px;
    ">
      <h2 style="color: #d32f2f">🚫 ${title}</h2>
      <p>${message}</p>
      ${
        details.length
          ? `
        <pre style="
          background: #f5f5f5;
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
        ">${details.join('\n')}</pre>
      `
          : ''
      }
      <p><strong>Resolution Steps:</strong></p>
      <ol>
        <li>Ensure that the <code>.env</code> file exists in the project root.</li>
        <li>Copy the contents from <code>.env.example</code> to <code>.env</code>.</li>
        <li>Fill in the <code>.env</code> file with your actual Firebase configuration values.</li>
      </ol>
      <p>
        Configuration values can be obtained from your 
        <a href="https://console.firebase.google.com" target="_blank" style="color: #1976d2">
          Firebase Console
        </a>.
      </p>
    </div>
  `
}

let app, auth, storage, db

try {
  // Initialize Firebase with the configuration object.
  app = initializeApp(firebaseConfig)

  // Initialize Firebase Authentication service.
  auth = getAuth(app)

  // Initialize Firebase Storage service.
  storage = getStorage(app)

  // Initialize Firestore database.
  db = getFirestore(app)
} catch (error) {
  console.error('Firebase initialization error:', error)

  let errorMessage = 'Invalid Firebase Configuration'
  let errorDetails = []

  if (error.code === 'auth/invalid-api-key') {
    errorMessage = 'Invalid Firebase API Key'
    errorDetails = ['The provided Firebase API key is invalid or incorrect.']
  } else if (error.code === 'auth/project-not-found') {
    errorMessage = 'Firebase Project Not Found'
    errorDetails = ['The specified Firebase project could not be found.']
  } else {
    errorDetails = [error.message]
  }

  // Display an error page with the configuration error details.
  showErrorPage('Firebase Configuration Error', errorMessage, errorDetails)
  throw error
}

export { auth, storage, db }
