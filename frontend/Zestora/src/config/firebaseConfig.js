// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA87KC8FovVm0Et-OMhdvpVEf9uSWyGMFU",
  authDomain: "zestora-dc0ed.firebaseapp.com",
  projectId: "zestora-dc0ed",
  storageBucket: "zestora-dc0ed.firebasestorage.app",
  messagingSenderId: "954677299621",
  appId: "1:954677299621:web:d7d1691adb67613129804c",
  measurementId: "G-Z0XMKZW3CF",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
