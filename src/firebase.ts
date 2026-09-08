import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import rawConfig from '../firebase-applet-config.json';

const firebaseConfig = {
  projectId: rawConfig.projectId || 'gen-lang-client-0652221186',
  appId: rawConfig.appId || '1:1049051468046:web:f13c867a7166153bfa475f',
  apiKey: rawConfig.apiKey || 'AIzaSyBwfu2Xj8-DBswwARCRgSemBYtD_aTGY8U',
  authDomain: rawConfig.authDomain || 'gen-lang-client-0652221186.firebaseapp.com',
  firestoreDatabaseId: rawConfig.firestoreDatabaseId || 'ai-studio-cb78b49b-382e-40e1-aa74-26e13768acdb',
  storageBucket: rawConfig.storageBucket || 'gen-lang-client-0652221186.firebasestorage.app',
  messagingSenderId: rawConfig.messagingSenderId || '1049051468046',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
