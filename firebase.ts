// Import the functions you need from the SDKs you need
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZgb1ekCDrv4cap45VyUZHjCbItVGGnfA",
  authDomain: "mealmate-5644d.firebaseapp.com",
  projectId: "mealmate-5644d",
  storageBucket: "mealmate-5644d.firebasestorage.app",
  messagingSenderId: "325456082891",
  appId: "1:325456082891:web:e89aaf149863f9e6bb284e",
  measurementId: "G-NFJM5846DS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if supported (not in SSR or unsupported environments)
let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export const auth = getAuth(app);
export { analytics };

export const db = getFirestore(app);
export const storage = getStorage(app);
