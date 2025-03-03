// lib/database.js - التعامل مع قاعدة البيانات
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  setDoc 
} from 'firebase/firestore';

// تكوين Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// حفظ تفاعل جديد في قاعدة البيانات
export async function saveInteraction(userId, interactionData) {
  try {
    const interactionWithTimestamp = {
      ...interactionData,
      timestamp: new Date().toISOString(),
      userId
    };
    
    await addDoc(collection(db, 'interactions'), interactionWithTimestamp);
    return { success: true };
  } catch (error) {
    console.error('Error saving interaction:', error);
    return { success: false, error: error.message };
  }
}

// جلب تاريخ التفاعلات للمستخدم
export async function getUserInteractions(userId, limit = 50) {
  try {
    const q = query(
      collection(db, 'interactions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const interactions = [];
    
    querySnapshot.forEach((doc) => {
      interactions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return interactions;
  } catch (error) {
    console.error('Error fetching user interactions:', error);
    return [];
  }
}

// حفظ قواعد طويلة المدى للمستخدم
export async function saveLongTermRules(userId, personId, rules) {
  try {
    const rulesData = {
      rules,
      updatedAt: new Date().toISOString(),
      userId
    };
    
    await setDoc(doc(db, 'longTermRules', `${userId}_${personId}`), rulesData);
    return { success: true };
  } catch (error) {
    console.error('Error saving long term rules:', error);
    return { success: false, error: error.message };
  }
}

// جلب القواعد الطويلة المدى للشخص
export async function getLongTermRules(userId, personId) {
  try {
    const docRef = doc(db, 'longTermRules', `${userId}_${personId}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().rules;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching long term rules:', error);
    return [];
  }
}

export default {
  saveInteraction,
  getUserInteractions,
  saveLongTermRules,
  getLongTermRules
};